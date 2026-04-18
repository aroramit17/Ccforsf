import LegalPage from "./LegalPage.jsx";
import SEO from "./components/SEO.jsx";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ccforsf.com/" },
        { "@type": "ListItem", "position": 2, "name": "Refund Policy", "item": "https://ccforsf.com/refund" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://ccforsf.com/refund",
      "name": "Refund Policy — CC for SF",
      "url": "https://ccforsf.com/refund",
      "isPartOf": { "@id": "https://ccforsf.com/#website" },
      "inLanguage": "en",
      "about": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
      },
    },
  ],
};

export default function RefundPolicy() {
  return (
    <>
    <SEO
      title="Refund Policy — CC for SF"
      description="The CC for SF course is backed by a 30-day, no-questions-asked money-back guarantee. If you went through the course and didn't level up, you get a full refund."
      path="/refund"
      jsonLd={JSON_LD}
    />
    <LegalPage title="Refund Policy" lastUpdated="April 17, 2026">
      <p>Your enrollment in the CC for SF course is backed by a <strong>30-day, no-questions-asked money-back guarantee</strong>.</p>

      <p>Here's the deal: go through the course. Try the prompts. Open Claude Code, connect it to your org, and actually use what you learn. If, after working through the material, you didn't find value — or you genuinely don't feel like you've leveled up as a Salesforce Admin — email me and I'll refund you in full. No hoops, no forms, no awkward exit survey.</p>

      <p>I'd rather you try it risk-free than wonder "what if."</p>

      <h2>How to Request a Refund</h2>
      <p>Send an email to <a href="mailto:aroramit.17@gmail.com">aroramit.17@gmail.com</a> from the email address you used to purchase, within 30 days of your original purchase date. Include your order confirmation if you have it handy. That's it.</p>
      <p>Refunds are issued back to the original payment method via our checkout provider, Thrivecart. Your card issuer controls the exact timing — typically 5–10 business days to appear on your statement.</p>

      <h2>What Happens After a Refund</h2>
      <p>Once your refund is processed, your access to the course, any bonus materials, and any private channels or groups will be revoked. You agree to stop using the course materials and to delete any downloaded files (video recordings, slide decks, CLAUDE.md templates, prompts, etc.).</p>

      <h2>Outside the 30-Day Window</h2>
      <p>After 30 days from purchase, refunds are no longer available. The course is lifetime access — so keep it, revisit it, and use it whenever the next Flow lands on your plate.</p>

      <h2>Questions</h2>
      <p>If you have any questions about this policy before or after purchasing, email <a href="mailto:aroramit.17@gmail.com">aroramit.17@gmail.com</a>. I read every message.</p>

      <p>This Refund Policy is incorporated by reference into the CC for SF <a href="/terms">Terms of Service</a>.</p>
    </LegalPage>
    </>
  );
}
