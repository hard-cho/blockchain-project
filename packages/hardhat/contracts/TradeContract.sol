// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeContract {
    // Структура для хранения информации о сделке
    struct Trade {
        address buyerAddress; // Покупатель
        address sellerAddress; // Продавец
        address mediatorAddress; // Арбитр (третья сторона)
        uint256 tradeAmount; // Сумма сделки
        TradeState tradeState; // Текущее состояние сделки
    }

    // Возможные состояния сделки
    enum TradeState { PENDING, COMPLETED, DISPUTED }

    // Маппинг для хранения сделок по их уникальному идентификатору
    mapping(uint256 => Trade) public trades;
    uint256 public tradeCounter; // Счетчик для идентификаторов сделок

    // Функция для создания новой сделки и депозита средств
    function initiateTrade(address _sellerAddress, address _mediatorAddress) external payable returns (uint256) {
        require(_sellerAddress != address(0) && _mediatorAddress != address(0), "Addresses must be valid and non-zero");
        require(msg.value > 0, "Deposit must be greater than zero");

        tradeCounter++;
        trades[tradeCounter] = Trade({
            buyerAddress: msg.sender,
            sellerAddress: _sellerAddress,
            mediatorAddress: _mediatorAddress,
            tradeAmount: msg.value,
            tradeState: TradeState.PENDING
        });

        return tradeCounter;
    }

    // Функция для подтверждения сделки покупателем
    function approveTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(msg.sender == trade.buyerAddress, "Action allowed only for the buyer");
        require(trade.tradeState == TradeState.PENDING, "Trade is not in a confirmable state");

        trade.tradeState = TradeState.COMPLETED;
        payable(trade.sellerAddress).transfer(trade.tradeAmount);
    }

    // Функция для инициирования спора
    function initiateDispute(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(msg.sender == trade.buyerAddress || msg.sender == trade.sellerAddress, "Only involved parties can dispute");
        require(trade.tradeState == TradeState.PENDING, "Dispute can only be raised for pending trades");

        trade.tradeState = TradeState.DISPUTED;
    }

    // Функция для разрешения спора арбитром
    function settleDispute(uint256 tradeId, bool favorSeller) external {
        Trade storage trade = trades[tradeId];
        require(msg.sender == trade.mediatorAddress, "Only the mediator can resolve disputes");
        require(trade.tradeState == TradeState.DISPUTED, "Trade must be in disputed state to settle");

        trade.tradeState = TradeState.COMPLETED;
        if (favorSeller) {
            payable(trade.sellerAddress).transfer(trade.tradeAmount);
        } else {
            payable(trade.buyerAddress).transfer(trade.tradeAmount);
        }
    }

    // Функция для получения информации о сделке
    function fetchTradeDetails(uint256 tradeId) external view returns (
        address buyer,
        address seller,
        address arbiter,
        uint256 amount,
        TradeState state
    ) {
        Trade storage trade = trades[tradeId];
        return (trade.buyerAddress, trade.sellerAddress, trade.mediatorAddress, trade.tradeAmount, trade.tradeState);
    }
}
