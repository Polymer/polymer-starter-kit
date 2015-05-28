"use strict"

sinon = require("sinon")

describe "Call context", ->
    spy = null
    target = null
    notTheTarget = null

    beforeEach ->
        spy = sinon.spy()
        target = {}
        notTheTarget = {}

    describe "calledOn", ->
        it "should throw an assertion error if the spy is never called", ->
            expect(-> spy.should.have.been.calledOn(target)).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called without a context", ->
            spy()

            expect(-> spy.should.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledOn(target)).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called on the wrong context", ->
            spy.call(notTheTarget)

            expect(-> spy.should.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledOn(target)).to.throw(AssertionError)

        it "should not throw if the spy is called on the specified context", ->
            spy.call(target)

            expect(-> spy.should.have.been.calledOn(target)).to.not.throw()
            expect(-> spy.getCall(0).should.have.been.calledOn(target)).to.not.throw()

        it "should not throw if the spy is called on another context and also the specified context", ->
            spy.call(notTheTarget)
            spy.call(target)

            expect(-> spy.should.have.been.calledOn(target)).to.not.throw()
            expect(-> spy.getCall(1).should.have.been.calledOn(target)).to.not.throw()

    describe "always calledOn", ->
        it "should throw an assertion error if the spy is never called", ->
            expect(-> spy.should.always.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledOn(target)).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called without a context", ->
            spy()

            expect(-> spy.should.always.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledOn(target)).to.throw(AssertionError)

        it "should throw an assertion error if the spy is called on the wrong context", ->
            spy.call(notTheTarget)

            expect(-> spy.should.always.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledOn(target)).to.throw(AssertionError)

        it "should not throw if the spy is called on the specified context", ->
            spy.call(target)

            expect(-> spy.should.always.have.been.calledOn(target)).to.not.throw()
            expect(-> spy.should.have.always.been.calledOn(target)).to.not.throw()
            expect(-> spy.should.have.been.always.calledOn(target)).to.not.throw()

        it "should throw an assertion error if the spy is called on another context and also the specified context", ->
            spy.call(notTheTarget)
            spy.call(target)

            expect(-> spy.should.always.have.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledOn(target)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledOn(target)).to.throw(AssertionError)

