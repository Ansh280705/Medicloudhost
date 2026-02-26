import React from "react";
import { Shield, Lock, Users, Database, FileText, Scale, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - DoctorDesk | Healthcare Data Protection",
  description: "DoctorDesk privacy policy - Learn how we protect your healthcare data, medical information, and ensure patient confidentiality on our secure platform.",
};

const PrivacyPage = () => {
  // Auto-update feature for Last Updated date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background py-1">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-client/10 text-client font-medium text-sm mb-4">
            <Shield className="h-4 w-4" />
            Your Privacy, Our Priority
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            <strong>Last Updated:</strong> {currentDate}
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              <span className="font-semibold text-client">DoctorDesk</span> ("we," "our," "us") values your trust and is committed to protecting your <span className="text-client font-medium">personal data</span>. This Privacy Policy explains how DoctorDesk collects, uses, stores, discloses, and protects information when you use our <span className="text-client font-medium">healthcare technology platform</span>, website, mobile application, and related digital services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using DoctorDesk, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-client/10">
                <Database className="h-6 w-6 text-client" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
            </div>

            <p className="text-muted-foreground mb-6">
              We collect information to provide secure, efficient, and personalized <span className="text-client font-medium">healthcare services</span>.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3">Personal Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Full name</li>
                  <li>• Email address</li>
                  <li>• Phone number</li>
                  <li>• Date of birth & Gender</li>
                  <li>• Address details</li>
                  <li>• Login credentials (encrypted)</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-5 border-l-4 border-l-client">
                <h3 className="font-semibold text-foreground mb-3">Health & Medical Data</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Appointment details</li>
                  <li>• Medical history</li>
                  <li>• Prescriptions & records</li>
                  <li>• Doctor communications</li>
                </ul>
                <div className="mt-4 p-2 bg-client/10 rounded text-xs text-client font-medium">
                  HIPAA Compliant
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3">Technical Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IP address</li>
                  <li>• Device & browser info</li>
                  <li>• Usage analytics</li>
                  <li>• Cookies & tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-client/10">
                <FileText className="h-6 w-6 text-client" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              DoctorDesk uses collected information for the following purposes:
            </p>

            <div className="bg-card border border-border rounded-lg p-6">
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Provide and manage healthcare services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Schedule and manage appointments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Improve platform functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Enable secure doctor-patient communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Process payments and billing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Comply with legal obligations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Send service notifications</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Cookies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-client/10">
                <Lock className="h-6 w-6 text-client" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">3. Cookies & Tracking Technologies</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              DoctorDesk uses <span className="text-client font-medium">cookies</span> to enhance website performance, analyze user behavior, improve security, and personalize content.
            </p>
            <p className="text-sm text-muted-foreground italic">
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          {/* Section 4: Data Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-client/10">
                <Shield className="h-6 w-6 text-client" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              <span className="font-semibold text-client">DoctorDesk</span> implements industry-standard security measures:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold text-client mb-1">SSL Encryption</h4>
                <p className="text-sm text-muted-foreground">End-to-end encryption for all data transfers</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold text-client mb-1">Secure Servers</h4>
                <p className="text-sm text-muted-foreground">Protected access controls and monitoring</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold text-client mb-1">Security Audits</h4>
                <p className="text-sm text-muted-foreground">Regular assessments and updates</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold text-client mb-1">Role-Based Access</h4>
                <p className="text-sm text-muted-foreground">Limited data access based on user roles</p>
              </div>
            </div>
          </section>

          {/* Section 6: Data Retention */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground mb-3">
              We retain personal and medical data only as long as necessary to provide healthcare services, comply with legal requirements, and resolve disputes.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Once data is no longer required, it is securely deleted or anonymized.
            </p>
          </section>

          {/* Section 7: User Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. User Rights & Choices</h2>
            <p className="text-muted-foreground mb-4">Depending on your jurisdiction, you may have the right to:</p>

            <div className="bg-card border border-border rounded-lg p-6">
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Access your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Request correction or update</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Withdraw consent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-client mt-1">✓</span>
                  <span>Restrict data processing</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Requests can be made by contacting us at{" "}
              <a href="mailto:doctordeskofficial@gmail.com" className="text-client font-semibold hover:underline">
                doctordeskofficial@gmail.com
              </a>
            </p>
          </section>

          {/* Section 8-9: Quick Info */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Links</h2>
            <p className="text-muted-foreground">
              DoctorDesk may contain links to third-party websites or services. We are not responsible for their privacy practices.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              DoctorDesk does not knowingly collect personal data from children under 18 without parental consent.
            </p>
          </section>

          {/* Section 10: Compliance */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-client/10">
                <Scale className="h-6 w-6 text-client" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">9. Compliance & Regulations</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              DoctorDesk strives to comply with applicable data protection laws:
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-card border-l-4 border-l-client rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">Information Technology Act, 2000 (India)</p>
              </div>
              <div className="bg-card border-l-4 border-l-client rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">Digital Personal Data Protection Act (DPDP)</p>
              </div>
              <div className="bg-card border-l-4 border-l-client rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">HIPAA principles (where applicable)</p>
              </div>
              <div className="bg-card border-l-4 border-l-client rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">GDPR principles for international users</p>
              </div>
            </div>
          </section>

          {/* Section 11: Changes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          {/* Section 12: Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-6">11. Contact Us</h2>

            <div className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Doctor<span className="text-client">Desk</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-client" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href="mailto:doctordeskofficial@gmail.com" className="text-client font-semibold hover:underline">
                      doctordeskofficial@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-client" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <span className="text-client font-semibold">+91 81094-24356</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Badge */}
        <div className="text-center pt-8 border-t border-border">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-client/10 text-client font-medium">
            <Lock className="h-5 w-5" />
            Secured & Compliant Healthcare Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
