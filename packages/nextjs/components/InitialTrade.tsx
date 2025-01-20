import { useState } from "react";
import { ethers } from "ethers";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function InitialTrade() {
  const [seller, setSeller] = useState("");
  const [arbiter, setArbiter] = useState("");
  const [amount, setAmount] = useState("");
  const { writeContractAsync } = useScaffoldWriteContract("TradeContract");

  const handleCreateDeal = async () => {
    if (!seller || !arbiter || !amount) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "initiateTrade",
        args: [seller, arbiter],
        value: ethers.parseEther(amount),
      });
      alert("Сделка успешно создана и депозит внесён!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании сделки.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Создание и депозит сделки</h3>
      <input
        type="text"
        placeholder="Адрес продавца"
        value={seller}
        onChange={e => setSeller(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Адрес арбитра"
        value={arbiter}
        onChange={e => setArbiter(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Сумма (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleCreateDeal}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Создать и внести депозит
      </button>
    </div>
  );
}
