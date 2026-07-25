import Badge from "./Badge.jsx";

/**
 * Renders one certificate-styled block. Fed either placeholder data (live
 * preview while building a template) or a real issued license, so the
 * template author always sees exactly what an enterprise will receive.
 */
export default function CertificatePreview({
  templateName,
  category,
  licenseNumber,
  enterpriseName,
  issueDate,
  expiryDate,
  feeETB,
  terms = [],
  status,
}) {
  return (
    <div className="certificate">
      <div className="certificate-border">
        <div className="certificate-head">
          <img src="/ministry-mark.svg" alt="" className="certificate-seal" />
          <div>
            <div className="certificate-issuer">Federal Democratic Republic of Ethiopia</div>
            <div className="certificate-issuer-sub">Ministry of Industry · Manufacturing BIS</div>
          </div>
          {status && <Badge>{status}</Badge>}
        </div>

        <div className="certificate-title">{templateName || "License Certificate"}</div>
        {category && <div className="certificate-category">{category}</div>}

        <div className="certificate-body">
          <div className="certificate-lede">This is to certify that</div>
          <div className="certificate-name">{enterpriseName || "— enterprise name —"}</div>
          <div className="certificate-lede">is duly licensed to operate under the terms of this certificate.</div>
        </div>

        <div className="certificate-meta">
          <div>
            <label>Certificate No.</label>
            <div className="mono">{licenseNumber || "PENDING"}</div>
          </div>
          <div>
            <label>Issue date</label>
            <div>{issueDate || "—"}</div>
          </div>
          <div>
            <label>Valid until</label>
            <div>{expiryDate || "—"}</div>
          </div>
          {feeETB != null && (
            <div>
              <label>License fee</label>
              <div>ETB {Number(feeETB).toLocaleString()}</div>
            </div>
          )}
        </div>

        {terms.length > 0 && (
          <div className="certificate-terms">
            <label>Terms &amp; conditions</label>
            <ul>
              {terms.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
