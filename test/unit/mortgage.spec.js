const expect = require('chai').expect;
const Mortgage = require('../../src/js/lib/mortgage');

describe('Mortgage Calculator', () => {
    let mortgageCalc = null;

    beforeEach(() => {
        mortgageCalc = new Mortgage(1000, 10, 1, 1);
    });

    it('should create a mortgage instance', () => {
        expect(mortgageCalc).to.be.an.instanceOf(Mortgage);
    });

    it('should create a monthlyPayment function', () => {
        expect(mortgageCalc.monthlyPayment).to.exist;
    });

    it('should return a value when monthly payment is called with valid inputs', () => {
        expect(mortgageCalc.monthlyPayment()).to.exist;
    });
    
    it('should calculate the correct monthly payment for known values', () => {
        expect(mortgageCalc.monthlyPayment()).to.equal('1100.00');
    });    
});