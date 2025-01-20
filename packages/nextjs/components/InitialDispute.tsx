import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function InitialDispute() {
  const [dealId, setDealId] = useState("");
  const { writeContractAsync } = useScaffoldWriteContract("TradeContract");

  const handleRaiseDispute = async () => {
    if (!dealId) {
      alert("Укажите ID сделки.");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "initiateDispute",
        args: [BigInt(dealId)],
      });
      alert("Спор успешно инициирован!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при инициировании спора.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Инициация спора</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleRaiseDispute}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Инициировать спор
      </button>
    </div>
  );
}
