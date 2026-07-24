import { useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CampaignCard({ campaign, onDelete }) {
  const { can } = useAuth();
  const navigate = useNavigate();
  const pct = Math.round((campaign.done / campaign.target) * 100);
  return (
    <Card>
      <div className="flexbtw">
        <div className="tag-name">{campaign.name}</div>
        <Badge>{campaign.status}</Badge>
      </div>
      <div className="tag-sub" style={{ marginBottom: 14 }}>{campaign.period}</div>
      <div className="flexbtw" style={{ fontSize: 12, marginBottom: 6 }}>
        <span className="muted">Completion</span>
        <span className="mono">{campaign.done.toLocaleString()} / {campaign.target.toLocaleString()}</span>
      </div>
      <ProgressBar pct={pct} />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Button variant="outline" size="sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate(`/collection/campaigns/${campaign.id}`)}>
          View
        </Button>
        {can("collection", "edit") && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/collection/campaigns/${campaign.id}/edit`)}>Manage</Button>
        )}
        {can("collection", "delete") && (
          <Button variant="error" size="sm" onClick={() => onDelete(campaign)}>Delete</Button>
        )}
      </div>
    </Card>
  );
}
