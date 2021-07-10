const chai = require("chai");
const expect = chai.expect;

describe("validator", () =>{

    const validator = require("../validator")();

    it("should properly validate dynamoose", () => {
        const dynamoose = require("dynamoose");
        expect( () => validator.validate("dynamoose", dynamoose)).to.not.throw();
    });

    it("should properly validate sequelize", () => {
        const { Sequelize } = require("sequelize");
        const sequelize = new Sequelize("sqlite::memory:", { logging: false});
        expect(() => validator.validate("sequelize", sequelize)).to.not.throw();
    });

    it("should properly validate mongoose", () => {
        const sequelize = require("mongoose");
        expect( () => validator.validate("mongoose", sequelize)).to.not.throw();
    });

    it("should error out for a non-object database library", () => {
        expect(() => validator.validate("", 1)).to.throw();
    });

    it("should error out for an invalid dynamoose", () => {
        expect(() => validator.validate("dynamoose", {})).to.throw();
    });

    it("should error out for an invalid sequelize", () => {
        expect(() => validator.validate("sequelize", {})).to.throw();
    });

    it("should error out for an invalid sequelize", () => {
        expect(() => validator.validate("sequelize", {})).to.throw();
    });    

    it("should error out for a non-supported library", () => {
        expect(() => validator.validate("non-supported", {})).to.throw();
    }); 
});