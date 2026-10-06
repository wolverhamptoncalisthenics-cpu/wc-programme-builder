// A plain-language starting point, not a substitute for proper legal
// advice — worth a solicitor's review if you want this fully airtight,
// especially given the injury/health-adjacent notes people submit.
// Edit the wording freely; just keep it accurate to what the app
// actually does if you change how data is handled.

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
          Legal
        </span>
        <h1 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2 mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-brand-light text-sm leading-relaxed font-body">
          <p>
            Wolverhampton Calisthenics ("we", "us") runs this website to build personalised
            training programmes for our community. This page explains what information we
            collect, why, and what you can do about it.
          </p>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              What we collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your email address and password, used to create and secure your account</li>
              <li>
                Your training goal, current level, days available, equipment access, and any
                injuries or limitations you choose to mention in the questionnaire
              </li>
              <li>The programme built for you, and your progress notes if you use the tracker</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Why we collect it
            </h2>
            <p>
              Solely to build and deliver a training programme matched to you, and to let you log
              back in and see it. We don't use your information for advertising, and we don't
              sell or share it with anyone outside of running this service.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Who can see it
            </h2>
            <p>
              Tom and Tim, as coaches, can see your questionnaire answers and account email in
              order to build your programme. Nobody else at Wolverhampton Calisthenics has
              access, and none of it is publicly visible.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Where it's stored
            </h2>
            <p>
              Your data is stored securely with Supabase, a third-party database provider. This
              website is hosted on Netlify. Email notifications to your coaches are sent via
              Resend. None of these providers use your data for their own purposes; they simply
              provide the infrastructure this site runs on.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Cookies and local storage
            </h2>
            <p>
              We don't use tracking or advertising cookies. Your browser stores a couple of small
              pieces of information locally on your device, such as whether you've unlocked a
              paid programme and your progress-tracker ticks, purely so the site remembers these
              between visits.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Your rights
            </h2>
            <p>
              You can ask us to see, correct, or delete the information we hold about you at any
              time, free of charge, by emailing{" "}
              <a
                href="mailto:wolverhamptoncalisthenics@gmail.com"
                className="text-brand-orange hover:text-white transition-colors"
              >
                wolverhamptoncalisthenics@gmail.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Changes to this policy
            </h2>
            <p>
              If how we handle your data changes meaningfully, we'll update this page and let our
              community know.
            </p>
          </div>

          <p className="text-brand-light/60 text-xs pt-4 border-t border-white/10">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
          </p>
        </div>
      </div>
    </div>
  );
}
