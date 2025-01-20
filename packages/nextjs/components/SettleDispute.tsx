import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function SettleDispute() {
  const [dealId, setDealId] = useState("");
  const [releaseToSeller, setReleaseToSeller] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("TradeContract");

  const handleResolve = async () => {
    if (!dealId) {
      alert("Укажите ID сделки.");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "settleDispute",
        args: [BigInt(dealId), releaseToSeller],
      });
      alert("Спор успешно разрешён!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при разрешении спора.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Разрешение спора</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <select
        value={Number(releaseToSeller)}
        onChange={e => setReleaseToSeller(e.target.value === "true")}
        className="w-full p-2 mb-4 border border-gray-300 rounded bg-white"
      >
        <option value="true">Перевести продавцу</option>
        <option value="false">Вернуть покупателю</option>
      </select>
      <button
        onClick={handleResolve}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Разрешить спор
      </button>
    </div>
  );
}
