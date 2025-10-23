/**
 * Terms.jsx
 * 
 * SCOPUL:
 * Terms of Service page
 * 
 * CONȚINUT:
 * - User agreement
 * - Acceptable use
 * - Limitation of liability
 * - Termination
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Terms() {
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">📜 Terms of Service</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Înapoi
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          
          {/* Last Updated */}
          <p className="text-sm text-gray-600">
            <strong>Last Updated:</strong> October 2024
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using quizzfun.app, you agree to be bound by these Terms of Service. 
              If you do not agree to any part of these terms, please do not use our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              quizzfun.app is an educational platform providing quiz-based learning in various subjects, 
              primarily history. The platform includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Interactive quiz gameplay</li>
              <li>User authentication and account management</li>
              <li>Progress tracking and statistics</li>
              <li>Leaderboards for competition</li>
              <li>Educational content and explanations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Account Creation:</strong> You are responsible for maintaining the confidentiality of your login credentials. 
              You agree to provide accurate information during registration.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Account Responsibility:</strong> You are responsible for all activity under your account. 
              You agree to notify us immediately of unauthorized access.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Authentication Methods:</strong> You may authenticate via email, Google account, or anonymously. 
              By using third-party auth, you agree to their terms as well.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the platform for any illegal or harmful purpose</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Manipulate scores, game mechanics, or leaderboards</li>
              <li>Engage in harassment, abuse, or discrimination</li>
              <li>Post spam, malware, or malicious content</li>
              <li>Violate intellectual property rights</li>
              <li>Reverse-engineer or scrape the platform</li>
              <li>Use automated tools to manipulate the service</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Our Content:</strong> All quiz content, questions, explanations, design, and materials 
              are owned by quizzfun.app and protected by copyright.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Your Content:</strong> You grant us a non-exclusive license to use any content you generate 
              (quiz responses, progress) for platform improvement and analytics.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>quizzfun.app is provided "AS IS" without warranties</li>
              <li>We are not liable for data loss, service interruption, or damages</li>
              <li>Our total liability is limited to $100 USD</li>
              <li>We are not responsible for third-party content or services</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Service Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue quizzfun.app at any time, 
              with or without notice. We are not liable for any consequences of such modifications.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>User Termination:</strong> You may delete your account at any time.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Our Termination:</strong> We may suspend or terminate your account for violations of these terms, 
              illegal activity, or abuse without prior notice.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless quizzfun.app and its creators from any claims, damages, 
              or expenses arising from your use of the platform or violation of these terms.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service are governed by the laws of the jurisdiction in which the platform creator resides, 
              without regard to conflicts of law provisions.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed">
              For any disputes, you agree to contact us first at perviat@gmail.com to attempt resolution. 
              If informal resolution fails, you agree to binding arbitration rather than court proceedings.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these terms is found invalid, that provision will be removed, 
              and the remaining terms will remain in effect.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> perviat@gmail.com</p>
              <p><strong>Platform:</strong> quizzfun.app</p>
              <p><strong>Creator:</strong> Ghergheluca Eduard</p>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service at any time. Changes will be posted on this page 
              with an updated "Last Updated" date. Continued use of quizzfun.app after changes constitutes acceptance.
            </p>
          </section>

        </div>

        {/* FOOTER LINKS */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Privacy Policy
          </a>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Înapoi →
          </button>
        </div>

      </main>

    </div>
  );
}

export default Terms;

/**
 * TERMS OF SERVICE
 * 
 * Conținut:
 * - Acceptance of terms
 * - Service description
 * - User accounts
 * - Acceptable use
 * - IP rights
 * - Limitation of liability
 * - Service modifications
 * - Termination
 * - Indemnification
 * - Governing law
 * - Dispute resolution
 * - Severability
 * - Contact
 * - Changes
 */