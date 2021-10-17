// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Rewards {
    address public owner;

    struct Customer {
        uint loyaltyPoints;
        uint totalBuys;
    }

    struct Product {
        string name;
        uint price;
    }

    uint etherPerPoint = 0.0005 ether;

    Product[] public products;
    mapping(address => Customer) public customers;
    mapping(address => Product[]) public customerProducts;
    mapping(address => uint) public customerTotalProducts;

    event ProductPurchase(address indexed customer, uint price);

    constructor() {
        owner = msg.sender;
        products.push(Product('Hamburguesa', 1 ether));
        products.push(Product('Alitas bufalo', 2 ether));
        products.push(Product('Papas fritas', 3 ether));
    }

    function buyProduct(uint productIndex) public payable {
        Product memory product = products[productIndex];
        require(msg.value == product.price);

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalBuys += 1;
        customerProducts[msg.sender].push(product);
        customerTotalProducts[msg.sender] ++;

        emit ProductPurchase(msg.sender, product.price);
    }

    function totalProducts() public view returns (uint) {
        return products.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        payable(msg.sender).transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getRewardBalance() public isOwner view returns (uint) {
        return address(this).balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}