"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sand-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-sand-900 mb-3">About Us</h3>
            <p className="text-sm text-sand-600 leading-relaxed">
              Livinexo helps households and flatmates manage shared expenses in one
              place with clarity, fairness, and less stress.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-sand-900 mb-3">
              Feedback & Suggestions
            </h3>
            <p className="text-sm text-sand-600 leading-relaxed mb-2">
              We are always improving. Share ideas, feature requests, or bugs so
              we can build a better experience.
            </p>
            <a
              href="mailto:hello@livinexo.com?subject=Feedback%20for%20Livinexo"
              className="text-sm font-medium text-haveli-700 hover:text-haveli-800 transition-colors"
            >
              Send your feedback
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-sand-900 mb-3">Contact Us</h3>
            <div className="space-y-1.5 text-sm text-sand-600">
              <p>Email: hello@livinexo.com</p>
              <p>Support: support@livinexo.com</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-sand-900 mb-3">Quick Links</h3>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link
                href="/dashboard"
                className="text-sand-600 hover:text-sand-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/expenses"
                className="text-sand-600 hover:text-sand-900 transition-colors"
              >
                Expenses
              </Link>
              <Link
                href="/analytics"
                className="text-sand-600 hover:text-sand-900 transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-sand-500">Made with love for modern households.</p>
          <p className="text-xs text-sand-500">© {year} Livinexo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
