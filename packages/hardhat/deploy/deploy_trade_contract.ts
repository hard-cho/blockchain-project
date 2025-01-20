import { HardhatRuntimeEnvironment } from "hardhat/types";

// Определяем функцию деплоя контракта
export default async function (hre: HardhatRuntimeEnvironment) {
  // Получаем объекты 'deployments' и 'getNamedAccounts' из среды выполнения
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments; // Получаем метод 'deploy' для деплоя контракта

  // Получаем аккаунты, используемые для деплоя
  const { deployer } = await getNamedAccounts();

  // Разворачиваем контракт "TradeContract" от имени деплойера
  await deploy("TradeContract", {
    from: deployer, // Указываем адрес деплойера
    log: true, // Включаем логирование процесса деплоя
  });
}
