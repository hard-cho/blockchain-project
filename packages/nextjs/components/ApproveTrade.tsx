import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function ApproveTrade() {
  const [dealId, setDealId] = useState("");
  const { writeContractAsync } = useScaffoldWriteContract("TradeContract");

  const handleConfirm = async () => {
    if (!dealId) {
      alert("Укажите ID сделки.");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "approveTrade",
        args: [BigInt(dealId)],
      });
      alert("Сделка успешно подтверждена!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при подтверждении сделки.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Подтверждение сделки</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleConfirm}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Подтвердить сделку
      </button>
    </div>
  );
}
