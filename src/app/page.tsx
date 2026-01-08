import ControlsPanel from "../components/ControlsPanel";
import MatrixTable from "../components/MatrixTable";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1152px] px-[16px] py-[24px]">
      <h1 className="text-[20px] leading-[28px] font-semibold">Matrix Test Task</h1>

      <div className="mt-[16px] flex flex-col gap-[16px]">
        <ControlsPanel />
        <MatrixTable />
      </div>
    </main>
  );
}
