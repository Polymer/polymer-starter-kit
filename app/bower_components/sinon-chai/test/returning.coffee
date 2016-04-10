"use strict"

sinon = require("sinon")

describe "Returning", ->
    describe "returned", ->
        it "should throw an assertion error if the spy does not return the correct value", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.have.returned(2)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.returned(2)).to.throw(AssertionError)

        it "should not throw if the spy returns the correct value", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.have.returned(1)).to.not.throw()
            expect(-> spy.getCall(0).should.have.returned(1)).to.not.throw()

        it "should not throw if the spy returns the correct value amongst others", ->
            values = [1, 2, 3]
            spy = sinon.spy.create(-> values[spy.callCount - 1])

            spy()
            spy()
            spy()

            expect(-> spy.should.have.returned(1)).to.not.throw()
            expect(-> spy.getCall(0).should.have.returned(1)).to.not.throw()

    describe "always returned", ->
        it "should throw an assertion error if the spy does not return the correct value", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.always.have.returned(2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.returned(2)).to.throw(AssertionError)

        it "should not throw if the spy returns the correct value", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.have.always.returned(1)).to.not.throw()
            expect(-> spy.should.always.have.returned(1)).to.not.throw()

        it "should throw an assertion error if the spy returns the correct value amongst others", ->
            values = [1, 2, 3]
            spy = sinon.spy.create(-> values[spy.callCount - 1])

            spy()
            spy()
            spy()

            expect(-> spy.should.always.have.returned(1)).to.throw(AssertionError)
            expect(-> spy.should.have.always.returned(1)).to.throw(AssertionError)
