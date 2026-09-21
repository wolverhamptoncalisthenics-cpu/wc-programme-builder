// A plain-language starting point, not a substitute for proper legal
// advice — worth a solicitor's review before relying on this fully,
// since real payments are involved. UK consumer law (the Consumer
// Contracts Regulations 2013) gives people buying services online a
// 14-day cancellation right by default; the wording below reflects a
// common, reasonable approach for bespoke coaching work specifically,
// but isn't a guarantee it's fully watertight as written.

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
          Legal
        </span>
        <h1 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2 mb-8">
          Refund Policy
        </h1>

        <div className="space-y-6 text-brand-light text-sm leading-relaxed font-body">
          <p>
            This page explains where you stand if you buy one of our paid programmes (currently
            the First Pull-Up Programme or the Press Handstand Programme, each £49.99) and want a
            refund.
          </p>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              What you're paying for
            </h2>
            <p>
              Each paid programme is 12 weeks of training programming, built by hand by Tom or
              Tim specifically for you, based on your questionnaire answers. It isn't a
              pre-made download, it's bespoke coaching work that begins as soon as you pay.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Before your programme is built
            </h2>
            <p>
              If you change your mind before Tom or Tim has started building your programme,
              email us and we'll refund you in full, no questions asked.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Once your programme is being built or has been delivered
            </h2>
            <p>
              By paying, you're asking us to begin this bespoke work straight away rather than
              waiting out the standard 14-day cooling-off period that normally applies to online
              purchases in the UK. Because of this, once Tom or Tim has started building your
              programme, we're not able to offer a full refund, since real coaching time has
              already gone into it specifically for you. If your programme has been fully
              delivered, the work is complete and non-refundable.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              If something's genuinely gone wrong
            </h2>
            <p>
              If your programme wasn't built as described, doesn't match your questionnaire
              answers at all, or something similarly went wrong on our end, get in touch and
              we'll put it right, whether that's fixing it or a partial or full refund depending
              on the situation. We want this to be fair, not a way to avoid helping you.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              How to request a refund
            </h2>
            <p>
              Email{" "}
              <a
                href="mailto:wolverhamptoncalisthenics@gmail.com"
                className="text-brand-orange hover:text-white transition-colors"
              >
                wolverhamptoncalisthenics@gmail.com
              </a>{" "}
              with your account email and which programme you purchased. We'll get back to you
              as soon as we can.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-white text-base uppercase mb-2">
              Your statutory rights
            </h2>
            <p>
              Nothing on this page affects your other legal rights as a consumer under UK law.
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
