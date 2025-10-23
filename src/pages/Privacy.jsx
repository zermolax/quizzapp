/**
 * Privacy.jsx
 * 
 * SCOPUL:
 * Privacy Policy page - GDPR compliant
 * 
 * CONȚINUT:
 * - Data collection info
 * - User rights
 * - Cookie policy
 * - Contact info
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Privacy() {
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">🔒 Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to quizzfun.app ("we," "us," "our," or "Company"). We are committed to protecting your privacy. 
              This Privacy Policy explains our data practices regarding the quizzfun.app platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              quizzfun.app is created and operated by Ghergheluca Eduard. We are committed to GDPR compliance and 
              user data protection.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. What Data We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Account Information:</strong> Email address, display name (optional)</li>
              <li><strong>Quiz Data:</strong> Quiz responses, scores, timestamps, duration</li>
              <li><strong>User Statistics:</strong> Total quizzes played, average score, best score, total points</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device type (via Google Analytics)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your data for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Providing and improving the quizzfun.app service</li>
              <li>Tracking your progress and displaying statistics</li>
              <li>Displaying your position in leaderboards</li>
              <li>Analyzing platform performance (Google Analytics)</li>
              <li>Detecting and preventing abuse</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Storage</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is stored securely on <strong>Google Firebase</strong>, which complies with GDPR and 
              international security standards. Data is encrypted in transit and at rest.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Google Firebase:</strong> Backend infrastructure and database</li>
              <li><strong>Google Analytics:</strong> Website usage analytics (anonymized)</li>
              <li><strong>Stripe:</strong> Payment processing (for future premium features)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              These services have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li><strong>Authentication:</strong> Firebase Auth cookies to keep you logged in</li>
              <li><strong>Analytics:</strong> Google Analytics cookies to track usage (anonymized)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can disable cookies in your browser settings, but this may affect functionality.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your GDPR Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Portability:</strong> Export your data in a portable format</li>
              <li><strong>Objection:</strong> Opt-out of data processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, contact us at <strong>perviat@gmail.com</strong>
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your data as long as your account is active. If you delete your account, 
              we will delete all associated data within 30 days, except where required by law.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              quizzfun.app is designed for educational purposes and may be used by minors under parental supervision. 
              We do not knowingly collect data from children under 13. If we become aware of such data, 
              we will delete it immediately.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>HTTPS encryption for all data in transit</li>
              <li>Firebase security rules for database access control</li>
              <li>Regular security audits</li>
              <li>No storage of sensitive payment information</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> perviat@gmail.com</p>
              <p><strong>Platform:</strong> quizzfun.app</p>
              <p><strong>Creator:</strong> Ghergheluca Eduard</p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Policy Changes</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy at any time. Changes will be posted on this page 
              with an updated "Last Updated" date. Continued use of quizzfun.app constitutes acceptance of changes.
            </p>
          </section>

        </div>

        {/* FOOTER LINKS */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Înapoi
          </button>
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Terms of Service →
          </a>
        </div>

      </main>

    </div>
  );
}

export default Privacy;

/**
 * PRIVACY POLICY - GDPR COMPLIANT
 * 
 * Conținut:
 * - Introduction
 * - Data collection
 * - Data usage
 * - Storage (Firebase)
 * - Third-party services
 * - Cookies
 * - GDPR rights
 * - Retention
 * - Children's privacy
 * - Security
 * - Contact info
 * - Policy changes
 */