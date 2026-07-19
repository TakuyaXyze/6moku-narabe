import { Title } from "../components/Title"
import { PlayGround } from "../components/PlayGround";
import "../styles/page.css"

export default function Home() {
  return (
    <div className="page">
      <Title />
      <PlayGround />
    </div>
  );
}