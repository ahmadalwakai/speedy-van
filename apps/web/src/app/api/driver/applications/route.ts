import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { withApiHandler, requireRole, httpJson } from '@/lib/api/guard';
import { parseJson, parseQueryParams } from '@/lib/validation/helpers';
import { driverApplicationCreate, paginationQuery, searchQuery } from '@/lib/validation/schemas';
import { prisma } from '@/lib/prisma';

// Function to send admin notification for new driver application
async function sendDriverApplicationNotification(application: any, files: { [key: string]: string }) {
  try {
    // Create comprehensive admin notification
    const notification = await prisma.adminNotification.create({
      data: {
        type: 'new_driver_application',
        title: `New Driver Application: ${application.firstName} ${application.lastName}`,
        message: `A new driver application has been submitted with email ${application.email}`,
        priority: 'high',
        data: {
          applicationId: application.id,
          driverName: `${application.firstName} ${application.lastName}`,
          email: application.email,
          phone: application.phone,
          dateOfBirth: application.dateOfBirth,
          nationalInsuranceNumber: application.nationalInsuranceNumber,
          
          // Address information
          address: {
            line1: application.addressLine1,
            line2: application.addressLine2,
            city: application.city,
            postcode: application.postcode,
            county: application.county,
          },
          
          // Driving information
          driving: {
            licenseNumber: application.drivingLicenseNumber,
            licenseExpiry: application.drivingLicenseExpiry,
            licenseFrontImage: files.drivingLicenseFront || null,
            licenseBackImage: files.drivingLicenseBack || null,
          },
          
          // Insurance information
          insurance: {
            provider: application.insuranceProvider,
            policyNumber: application.insurancePolicyNumber,
            expiry: application.insuranceExpiry,
            document: files.insuranceDocument || null,
          },
          
          // Banking information
          banking: {
            bankName: application.bankName,
            accountHolderName: application.accountHolderName,
            sortCode: application.sortCode,
            accountNumber: application.accountNumber,
          },
          
          // Right to work
          rightToWork: {
            shareCode: application.rightToWorkShareCode,
            document: files.rightToWorkDocument || null,
          },
          
          // Emergency contact
          emergencyContact: {
            name: application.emergencyContactName,
            phone: application.emergencyContactPhone,
            relationship: application.emergencyContactRelationship,
          },
          
          // Terms agreement
          terms: {
            agreeToTerms: application.agreeToTerms,
            agreeToDataProcessing: application.agreeToDataProcessing,
            agreeToBackgroundCheck: application.agreeToBackgroundCheck,
          },
          
          // Application metadata
          applicationDate: application.applicationDate,
          status: application.status,
        },
        actionUrl: `/admin/drivers/applications/${application.id}`,
        actorId: application.userId,
        actorRole: 'driver_applicant',
        isRead: false,
        createdAt: new Date(),
      }
    });

    console.log('✅ Admin notification created for driver application:', notification.id);

    // Send email notification to admin
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/driver-application-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationData: {
            applicationId: application.id,
            userId: application.userId,
            driverName: `${application.firstName} ${application.lastName}`,
            email: application.email,
            phone: application.phone,
            dateOfBirth: application.dateOfBirth,
            nationalInsuranceNumber: application.nationalInsuranceNumber,
            address: {
              line1: application.addressLine1,
              line2: application.addressLine2,
              city: application.city,
              postcode: application.postcode,
              county: application.county,
            },
            driving: {
              licenseNumber: application.drivingLicenseNumber,
              licenseExpiry: application.drivingLicenseExpiry,
              licenseFrontImage: files.drivingLicenseFront || null,
              licenseBackImage: files.drivingLicenseBack || null,
            },
            insurance: {
              provider: application.insuranceProvider,
              policyNumber: application.insurancePolicyNumber,
              expiry: application.insuranceExpiry,
              document: files.insuranceDocument || null,
            },
            banking: {
              bankName: application.bankName,
              accountHolderName: application.accountHolderName,
              sortCode: application.sortCode,
              accountNumber: application.accountNumber,
            },
            rightToWork: {
              shareCode: application.rightToWorkShareCode,
              document: files.rightToWorkDocument || null,
            },
            emergencyContact: {
              name: application.emergencyContactName,
              phone: application.emergencyContactPhone,
              relationship: application.emergencyContactRelationship,
            },
            terms: {
              agreeToTerms: application.agreeToTerms,
              agreeToDataProcessing: application.agreeToDataProcessing,
              agreeToBackgroundCheck: application.agreeToBackgroundCheck,
            },
            applicationDate: application.applicationDate,
            status: application.status,
          }
        }),
      });

      if (emailResponse.ok) {
        console.log('✅ Email notification sent for driver application');
      } else {
        console.warn('⚠️ Failed to send email notification:', await emailResponse.text());
      }
    } catch (emailError) {
      console.warn('⚠️ Error sending email notification:', emailError);
      // Don't fail the application submission if email fails
    }

    return notification;
  } catch (error) {
    console.error('❌ Error creating admin notification:', error);
    // Don't throw error - notification failure shouldn't break the application submission
  }
}

// POST /api/driver/applications - Submit driver application
export const POST = withApiHandler(async (request: NextRequest) => {
  // No auth required for public driver applications
  const formData = await request.formData();
  
  // Extract form data
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const nationalInsuranceNumber = formData.get('nationalInsuranceNumber') as string;
  
  // Address information
  const addressLine1 = formData.get('addressLine1') as string;
  const addressLine2 = formData.get('addressLine2') as string;
  const city = formData.get('city') as string;
  const postcode = formData.get('postcode') as string;
  const county = formData.get('county') as string;
  
  // Driving information
  const drivingLicenseNumber = formData.get('drivingLicenseNumber') as string;
  const drivingLicenseExpiry = formData.get('drivingLicenseExpiry') as string;
  
  // Insurance information
  const insuranceProvider = formData.get('insuranceProvider') as string;
  const insurancePolicyNumber = formData.get('insurancePolicyNumber') as string;
  const insuranceExpiry = formData.get('insuranceExpiry') as string;
  
  // Banking information
  const bankName = formData.get('bankName') as string;
  const accountHolderName = formData.get('accountHolderName') as string;
  const sortCode = formData.get('sortCode') as string;
  const accountNumber = formData.get('accountNumber') as string;
  
  // Right to work
  const rightToWorkShareCode = formData.get('rightToWorkShareCode') as string;
  
  // Emergency contact
  const emergencyContactName = formData.get('emergencyContactName') as string;
  const emergencyContactPhone = formData.get('emergencyContactPhone') as string;
  const emergencyContactRelationship = formData.get('emergencyContactRelationship') as string;
  
  // Terms agreement
  const agreeToTerms = formData.get('agreeToTerms') === 'true';
  const agreeToDataProcessing = formData.get('agreeToDataProcessing') === 'true';
  const agreeToBackgroundCheck = formData.get('agreeToBackgroundCheck') === 'true';

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || 
      !nationalInsuranceNumber || !addressLine1 || !city || !postcode || 
      !drivingLicenseNumber || !drivingLicenseExpiry || !insuranceProvider || 
      !insurancePolicyNumber || !insuranceExpiry || !bankName || !sortCode || 
      !accountNumber || !rightToWorkShareCode || !emergencyContactName || 
      !emergencyContactPhone || !emergencyContactRelationship) {
    return httpJson(400, { error: 'Missing required fields' });
  }

  // Validate terms agreement
  if (!agreeToTerms || !agreeToDataProcessing || !agreeToBackgroundCheck) {
    return httpJson(400, { error: 'You must agree to all terms and conditions' });
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return httpJson(409, { error: 'Email already registered. Please use a different email address or try logging in.' });
  }

  // Check if driver application already exists
  const existingApplication = await prisma.driverApplication.findUnique({
    where: { email },
    include: { user: true }
  });

  if (existingApplication) {
    // If application exists but no user, this means a previous submission failed
    if (!existingApplication.userId) {
      // Delete the orphaned application and allow resubmission
      await prisma.driverApplication.delete({
        where: { id: existingApplication.id }
      });
    } else {
      return httpJson(409, { error: 'Application already submitted with this email. Please contact support if you need to update your application.' });
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Handle file uploads
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'driver-applications');
  await mkdir(uploadDir, { recursive: true });

  const files: { [key: string]: string } = {};

  // Process file uploads
  const fileFields = [
    'drivingLicenseFront',
    'drivingLicenseBack', 
    'insuranceDocument',
    'rightToWorkDocument'
  ];

  for (const field of fileFields) {
    const file = formData.get(field) as File;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const fileName = `${Date.now()}-${field}-${file.name}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      files[field] = `/uploads/driver-applications/${fileName}`;
    }
  }

  // Create driver application
  const application = await prisma.driverApplication.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      phoneNormalized: phone.replace(/^\+44/, '44').replace(/^0/, '44'),
      dateOfBirth: new Date(dateOfBirth),
      nationalInsuranceNumber,
      addressLine1,
      addressLine2,
      city,
      postcode,
      county,
      drivingLicenseNumber,
      drivingLicenseExpiry: new Date(drivingLicenseExpiry),
      drivingLicenseFrontImage: files.drivingLicenseFront || null,
      drivingLicenseBackImage: files.drivingLicenseBack || null,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceExpiry: new Date(insuranceExpiry),
      insuranceDocument: files.insuranceDocument || null,
      bankName,
      accountHolderName,
      sortCode,
      accountNumber,
      rightToWorkShareCode,
      rightToWorkDocument: files.rightToWorkDocument || null,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactPhoneNormalized: emergencyContactPhone.replace(/^\+44/, '44').replace(/^0/, '44'),
      emergencyContactRelationship,
      agreeToTerms,
      agreeToDataProcessing,
      agreeToBackgroundCheck,
      status: 'pending',
      applicationDate: new Date(),
    },
  });

  // Create user account (inactive until approved)
  const user = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: 'driver',
      isActive: false, // Will be activated when admin approves
    },
  });

  // Update the driver application to link it to the user
  await prisma.driverApplication.update({
    where: { id: application.id },
    data: { userId: user.id },
  });

  // Send comprehensive admin notification with all application details
  await sendDriverApplicationNotification(application, files);

  return httpJson(201, {
    message: 'Application submitted successfully',
    applicationId: application.id,
    userId: user.id,
  });
});

// GET /api/driver/applications - Get driver applications (admin only)
export const GET = withApiHandler(async (request: NextRequest) => {
  const auth = await requireRole(request, "admin");
  if (auth) return auth;

  const queryParams = parseQueryParams(request.url, paginationQuery.merge(searchQuery));
  if (!queryParams.ok) return queryParams.error;

  const { page, limit, status } = queryParams.data;
  const skip = (page - 1) * limit;

  const where = status ? { status: status as any } : {};

  const [applications, total] = await Promise.all([
    prisma.driverApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { applicationDate: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    }),
    prisma.driverApplication.count({ where }),
  ]);

  return httpJson(200, {
    applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
