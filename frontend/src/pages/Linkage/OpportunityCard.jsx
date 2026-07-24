import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import { useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function OpportunityCard({ opp, onDelete }) {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { run, pending } = useApiAction("post");
  const { notify } = useSnackbar();

  async function expressInterest() {
    await run(`/linkage/opportunities/${opp.id}/interest`);
    notify("Interest recorded — the enterprise will be notified.", "success");
  }

  return (
    <div className="opp-card">
      <div className="cat">{opp.category}</div>
      <h4>{opp.title}</h4>
      <p>{opp.body}</p>
      <div className="opp-meta"><span>📍 {opp.region}</span><span>👁 {opp.views} views</span></div>
      <div className="flexbtw" style={{ marginTop: 12 }}>
        <span className="muted" style={{ fontSize: 11.5 }}>Expires {opp.expires}</span>
        <Button size="sm" disabled={pending} onClick={expressInterest}>Express interest</Button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Button variant="outline" size="sm" onClick={() => navigate(`/linkage/opportunities/${opp.id}`)}>View</Button>
        {can("linkage", "edit") && <Button variant="outline" size="sm" onClick={() => navigate(`/linkage/opportunities/${opp.id}/edit`)}>Edit</Button>}
        {can("linkage", "delete") && <Button variant="error" size="sm" onClick={() => onDelete(opp)}>Delete</Button>}
      </div>
    </div>
  );
}
