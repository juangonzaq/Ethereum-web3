const Reward = artifacts.require('Rewards');
let instance;

beforeEach(async () => {
    instance = await Reward.new();
});

contract('Reward', accounts => {
    it('should have available products', async() => {
        let totalProducts = await instance.totalProducts();
        assert(totalProducts > 0);
    });

    it('should allow customers to buy a product provinding its value', async() => {
        let product = await instance.products(0);
        let productName = product[0], price = product[1];
        
        await instance.buyProduct(0, {from: accounts[0], value: price});
        const customerProduct = await instance.customerProducts(accounts[0], 0);
        const customerTotalProducts = await instance.customerTotalProducts(accounts[0]);
        
        assert(customerProduct[0], productName);
        assert(customerProduct[1], price);
        assert(customerTotalProducts, 1);
    });

    it('should not allow customers to buy products under the price', async() => {
        let product = await instance.products(0);
        let price = product[1] - 5000;
        try {
            await instance.buyProduct(0, {from: accounts[0], value: price});
        } catch (e) {
            return;
        }
        assert.fail();
    });

    it('should get the real balance of the contract', async() => {
        let product = await instance.products(0);
        let price = product[1];

        let product2 = await instance.products(1);
        let price2 = product2[1];

        await instance.buyProduct(0, {from: accounts[0], value: price});
        await instance.buyProduct(1, {from: accounts[0], value: price2});

        let newRewardsBalance = await instance.getRewardBalance();
        assert.equal(parseFloat(newRewardsBalance), parseFloat(price) + parseFloat(price2))  
        //assert.equal(newRewardsBalance, price + price2);
    });

    if('should allow customers to reem loyalty points', async() => {
        let product = await instance.products(1);
        let price = product[1];

        await instance.buyProduct(1, {from: accounts[0], value: price});
        let balance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints({from: accounts[0]});
        let finalBalance = await web3.eth.getBalance(accounts[0]);

        let customer = await instance.customers(accounts[0]);
        let loyaltyPoints = customer[0];

        assert(loyaltyPoints, 0);
        assert(finalBalance > balance);

    });
});