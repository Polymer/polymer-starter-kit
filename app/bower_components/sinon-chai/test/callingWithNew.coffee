"use strict"

sinon = require("sinon")

describe "Calling with new", ->
    spy = null

    beforeEach ->
        spy = sinon.spy()

    describe "calledWithNew", ->
        it "should throw an assertion error if the spy is never called", ->
            expect(-> spy.should.have.been.calledWithNew).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called without `new`", ->
            spy()

            expect(-> spy.should.have.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledWithNew).to.throw(AssertionError)

        it "should not throw if the spy is called with `new`", ->
            new spy()

            expect(-> spy.should.have.been.calledWithNew).to.not.throw()
            expect(-> spy.getCall(0).should.have.been.calledWithNew).to.not.throw()

        it "should not throw if the spy is called with `new` and also without `new`", ->
            spy()
            new spy()

            expect(-> spy.should.have.been.calledWithNew).to.not.throw()
            expect(-> spy.getCall(1).should.have.been.calledWithNew).to.not.throw()

    describe "always calledWithNew", ->
        it "should throw an assertion error if the spy is never called", ->
            expect(-> spy.should.always.have.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithNew).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called without `new`", ->
            spy()

            expect(-> spy.should.always.have.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithNew).to.throw(AssertionError)

        it "should not throw if the spy is called with `new`", ->
            new spy()

            expect(-> spy.should.always.have.been.calledWithNew).to.not.throw()
            expect(-> spy.should.have.always.been.calledWithNew).to.not.throw()
            expect(-> spy.should.have.been.always.calledWithNew).to.not.throw()

        it "should throw an assertion error if the spy is called with `new` and also without `new`", ->
            spy()
            new spy()

            expect(-> spy.should.always.have.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithNew).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithNew).to.throw(AssertionError)


