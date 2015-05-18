"use strict"

sinon = require("sinon")

describe "Call order", ->
    spy1 = null
    spy2 = null

    beforeEach ->
        spy1 = sinon.spy()
        spy2 = sinon.spy()

    describe "spy1 calledBefore spy2", ->
        it "should throw an assertion error when neither spy is called", ->
            expect(-> spy1.should.have.been.calledBefore(spy2)).to.throw(AssertionError)

        it "should not throw when only spy 1 is called", ->
            spy1()

            expect(-> spy1.should.have.been.calledBefore(spy2)).to.not.throw()

        it "should throw an assertion error when only spy 2 is called", ->
            spy2()

            expect(-> spy1.should.have.been.calledBefore(spy2)).to.throw(AssertionError)

        it "should not throw when spy 1 is called before spy 2", ->
            spy1()
            spy2()

            expect(-> spy1.should.have.been.calledBefore(spy2)).to.not.throw()

        it "should throw an assertion error when spy 1 is called after spy 2", ->
            spy2()
            spy1()

            expect(-> spy1.should.have.been.calledBefore(spy2)).to.throw(AssertionError)

    describe "spy1 calledAfter spy2", ->
        it "should throw an assertion error when neither spy is called", ->
            expect(-> spy1.should.have.been.calledAfter(spy2)).to.throw(AssertionError)

        it "should throw an assertion error when only spy 1 is called", ->
            spy1()

            expect(-> spy1.should.have.been.calledAfter(spy2)).to.throw(AssertionError)

        it "should throw an assertion error when only spy 2 is called", ->
            spy2()

            expect(-> spy1.should.have.been.calledAfter(spy2)).to.throw(AssertionError)

        it "should throw an assertion error when spy 1 is called before spy 2", ->
            spy1()
            spy2()

            expect(-> spy1.should.have.been.calledAfter(spy2)).to.throw(AssertionError)

        it "should not throw when spy 1 is called after spy 2", ->
            spy2()
            spy1()

            expect(-> spy1.should.have.been.calledAfter(spy2)).to.not.throw()
