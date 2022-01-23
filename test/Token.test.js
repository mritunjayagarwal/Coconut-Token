import {EVM_REVERT, tokens} from './helpers';
const Token = artifacts.require("./Token");
const web3 = require('web3');

require('chai') //used for testing purposes
.use(require('chai-as-promised'))
.should()

contract('Token', ([deployer, receiver, exchange]) => {
    const name = 'Coconut Token';
    const symbol = 'COCO';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
    let token;

    beforeEach(async() => { //only mocha allows this function
        token = await Token.new(); //Fetch token from blockchain, same as const token = await Token.deployed();
    });

    describe('deployment', () => {
        it('tracks the name', async () => {
            
            const result = await token.name(); //Read token name here....
            result.should.equal(name); //The token name is 'My Name'
        });

        it('tracks the symbol', async() => {
            const result = await token.symbol();
            result.should.equal(symbol);
        });

        it('tracks the decimals', async() => {
            const result = await token.decimals(); 
            result.toString().should.equal(decimals);
        });

        it('tracks the total supply', async() => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply.toString());
        });

        it('assigns total supply of the deployer', async() => {
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply.toString());
        })
    })

    describe('sending tokens', () => {

        let amount;
        let result; 

        describe('success', async () => {
            beforeEach(async() => {
                //transfer
                amount = tokens(100)
                result = await token.transfer(receiver, amount, {from: deployer}) //{from: } web3 concept.
            })
    
            it('transfers token balances', async () => {
                let balanceOf;
                //after transfer
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(999900).toString());
                console.log("deployer balance after transfer", balanceOf.toString());
    
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());
                console.log("receiver balance after transfer", balanceOf.toString());
            });
    
            it("emits a transfer event", async() => {
                const log = result.logs[0]
                log.event.should.eq('Transfer');
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct');
                event.to.should.equal(receiver, 'to is correct');
                event.value.toString().should.equal(amount.toString(), 'amount is equal');
            })
        }) 

        describe('failure', async () => {
            
            it('rejects insufficient balances', async () => {
                let invalidAmount;
                invalidAmount = tokens(100000000) // 100 million - greater than total supply
                await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(EVM_REVERT);
            })

            it('REJECTS INVALID RECIPIENTS', async () => {
                await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
            })

        }) 
    })

    describe('approving tokens', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100);
            result = await token.approve(exchange, amount, { from: deployer})
        })

        describe('success', () => {
            it('allocates an allowance for delegated token spending on an exchange', async () => {
                const allowance = await token.allowance(deployer, exchange);
                allowance.toString().should.equal(amount.toString());
            })

            it("emits a Approval event", async() => {
                const log = result.logs[0]
                log.event.should.eq('Approval');
                const event = log.args
                event.owner.toString().should.equal(deployer, 'owner is correct');
                event.spender.should.equal(exchange, 'to is correct');
                event.value.toString().should.equal(amount.toString(), 'amount is equal');
            })
        })

        describe('failure', () => {
            it('REJECTS INVALID spenders', async () => {
                await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
            })
        })
    })
})
