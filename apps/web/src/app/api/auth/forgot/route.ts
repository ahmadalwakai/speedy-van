import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });
    
    // Log the password reset request
    await logAudit({ 
      action: "password_reset_requested", 
      targetType: "auth", 
      targetId: user.id, 
      before: null, 
      after: { email: user.email } 
    });

    // Send password reset email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset?token=${resetToken}`;
    
    try {
      const sg = require("@sendgrid/mail");
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        sg.setApiKey(process.env.SENDGRID_API_KEY);
        
        await sg.send({
          to: user.email,
          from: process.env.MAIL_FROM || 'noreply@speedy-van.co.uk',
          subject: 'Reset Your Password - Speedy Van',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Reset Your Password</h2>
              <p>Hello,</p>
              <p>You requested a password reset for your Speedy Van account. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              </div>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <p>Best regards,<br>The Speedy Van Team</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #6b7280;">
                Speedy Van<br>
                140 Charles Street, Glasgow City, G21 2QB<br>
                Phone: +44 7901846297<br>
                Email: support@speedy-van.co.uk
              </p>
            </div>
          `,
        });
      } else {
        console.warn('SendGrid API key not configured, password reset email not sent');
      }
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
