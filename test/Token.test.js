const Token = artifacts.require("./Token");

require('chai') //used for testing purposes
.use(require('chai-as-promised'))
.should()
contract('Token', (accounts) => {
    const name = 'Coconut Token';
    const symbol = 'COCO';
    const decimals = '18';
    const totalSupply = '1000000000000000000000000';
    let token;

    beforeEach(async() => { //only mocha allows this function
        token = await Token.new(); //Fetch token from blockchain, same as const token = await Token.deployed();
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
            
            const result = await token.name(); //Read token name here....
            result.should.equal(name); //The token name is 'My Name'
        })

        it('tracks the symbol', async() => {
            const result = await token.symbol();
            result.should.equal(symbol);
        })

        it('tracks the decimals', async() => {
            const result = await token.decimals(); 
            result.toString().should.equal(decimals);
        })

        it('tracks the total supply', async() => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply);
        })
    })
})
