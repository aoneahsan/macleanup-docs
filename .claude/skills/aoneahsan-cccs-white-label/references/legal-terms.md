# Legal terms

The master record is `projects-finalization-record/production/WHITE-LABEL-TERMS.md`. Each product writes these
clauses in its own voice; the substance below never changes without the owner.

## Clauses every product carries

1. **What a white-label licence is.** We run the product under the buyer's name: we host it, deploy it, connect
   their domain and apply their name, logo and colours. The buyer gets a licence to offer it to their users.
2. **No source code.** A licence does not transfer or disclose source code. Code changes hands only with a buyout.
3. **Non-exclusive until a buyout.** We may license the same product to other buyers until someone buys it outright.
4. **Groups.** The licence covers the platform groups paid for (web, mobile = Android + iOS, extension = Chrome +
   Firefox + Edge, package, desktop). iOS is delivered when the buyer provides or funds an Apple developer account.
5. **Updates.** Six months of product updates from the purchase date. After that, updates continue with a renewal
   (3, 6 or 12 months). Without one the deployment keeps running on its last version.
6. **Custom work.** Changes made only for the buyer are quoted and paid separately.
7. **Buyout.** The buyer receives the source code of every repository that builds the groups the product ships,
   with six months of updates, and the product is theirs. After a buyout we stop selling the product to anyone else.
   Licences sold before it keep their terms. 🔴 **Royalty (owner, 2026-11-14):** the buyer pays us a perpetual royalty of 7% of the gross revenue the product earns (excluding sales tax/VAT collected), paid quarterly with a revenue statement, for as long as the product earns revenue, including after a resale.
   Name it plainly in the buyout page (one line), the licence terms and the Terms of Service.
8. **Verification.** Each deployment carries a licence key and a file at
   `/.well-known/<product>-white-label-license.json`; anyone can check it at `/verify-license`.
9. **Revocation.** A licence used outside its terms, or on a domain it does not cover, may be revoked.
10. **Payments are final.** NO REFUNDS. This sentence appears **only** in the Terms of Service and the Privacy
    Policy, never on a pay surface (`~/.claude/rules/payment-copy.md`).
11. **Third-party costs** the buyer chooses (their domain, store accounts, paid services) are theirs.

## Where they go

- Terms of Service: a "White-label licences and buyouts" section with clauses 1–11.
- Privacy Policy: what buyer data is kept (name, email, company, domain, order) and that FilesHub processes it
  for us; the payment-finality line.
- 🔴 Privacy Policy, every product: the white-label and verify pages fetch prices, quotes and licence checks from our
  licensing service in the visitor's browser (their IP and the request reach it), and checkout opens the payment
  provider. A policy or legal bar that promises "nothing third-party", "no requests elsewhere" or similar must be
  corrected in the same release (dummy first, then the app's catalogue), or the page is no longer true.
- `/white-label/license-terms`: clauses 1–9 and 11 in plain words, linking to the Terms for the rest.
- Payment is by Wise transfer, never Polar (owner, 2026-11-14): Terms say a transfer counts as paid only once we confirm it, and the licence is
  issued then; Privacy says we keep the transfer reference and any proof the buyer uploads, to verify the payment.
- Client projects never name FilesHub; this standard never runs in a client project.
