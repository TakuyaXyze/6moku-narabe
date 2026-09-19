import { Title } from "../components/Title"
import { StageFlow } from "../components/StageFlow";
import "../styles/page.css"

export default function Home() {
  return (
    <div className="page">
      <Title />
      <StageFlow />
    </div>
  );
}