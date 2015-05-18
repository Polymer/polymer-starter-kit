"use strict"

sinon = require("sinon")

describe "Throwing", ->
    describe "thrown()", ->
        it "should throw an assertion error if the spy does not throw at all", ->
            spy = sinon.spy.create(->)

            spy()

            expect(-> spy.should.have.thrown()).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.thrown()).to.throw(AssertionError)

        it "should not throw if the spy throws", ->
            spy = sinon.spy.create(-> throw new Error())

            swallow(spy)

            expect(-> spy.should.have.thrown()).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown()).to.not.throw()

        it "should not throw if the spy throws once but not the next time", ->
            spy = sinon.spy.create(-> throw new Error() unless spy.callCount > 1)

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.thrown()).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown()).to.not.throw()

    describe "thrown(errorObject)", ->
        error = null

        beforeEach ->
            error = new Error("boo!")

        it "should throw an assertion error if the spy does not throw at all", ->
            spy = sinon.spy.create(->)

            spy()

            expect(-> spy.should.have.thrown(error)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.thrown(error)).to.throw(AssertionError)

        it "should throw an assertion error if the spy throws the wrong error", ->
            spy = sinon.spy.create(-> new Error("eek!"))

            swallow(spy)

            expect(-> spy.should.have.thrown(error)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.thrown(error)).to.throw(AssertionError)

        it "should not throw if the spy throws", ->
            spy = sinon.spy.create(-> throw error)

            swallow(spy)

            expect(-> spy.should.have.thrown(error)).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown(error)).to.not.throw()

        it "should not throw if the spy throws once but not the next time", ->
            spy = sinon.spy.create(-> throw error unless spy.callCount > 1)

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.thrown(error)).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown(error)).to.not.throw()

    describe "thrown(errorTypeString)", ->
        error = null

        beforeEach ->
            error = new TypeError("boo!")

        it "should throw an assertion error if the spy does not throw at all", ->
            spy = sinon.spy.create(->)

            spy()

            expect(-> spy.should.have.thrown("TypeError")).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.thrown("TypeError")).to.throw(AssertionError)

        it "should throw an assertion error if the spy throws the wrong type of error", ->
            spy = sinon.spy.create(-> throw new Error("boo!"))

            swallow(spy)

            expect(-> spy.should.have.thrown("TypeError")).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.thrown("TypeError")).to.throw(AssertionError)

        it "should not throw if the spy throws the correct type of error", ->
            spy = sinon.spy.create(-> throw new TypeError("eek!"))

            swallow(spy)

            expect(-> spy.should.have.thrown("TypeError")).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown("TypeError")).to.not.throw()

        it "should not throw if the spy throws once but not the next time", ->
            spy = sinon.spy.create(-> throw error unless spy.callCount > 1)

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.thrown("TypeError")).to.not.throw()
            expect(-> spy.getCall(0).should.have.thrown("TypeError")).to.not.throw()

    describe "always thrown", ->
        error = null

        beforeEach ->
            error = new TypeError("boo!")

        it "should throw an assertion error if the spy throws once but not the next time", ->
            spy = sinon.spy.create(-> throw error unless spy.callCount > 1)

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.always.thrown()).to.throw(AssertionError)
            expect(-> spy.should.always.have.thrown()).to.throw(AssertionError)
            expect(-> spy.should.have.always.thrown(error)).to.throw(AssertionError)
            expect(-> spy.should.always.have.thrown(error)).to.throw(AssertionError)
            expect(-> spy.should.have.always.thrown("TypeError")).to.throw(AssertionError)
            expect(-> spy.should.always.have.thrown("TypeError")).to.throw(AssertionError)

        it "should throw an assertion error if the spy throws the wrong error the second time", ->
            spy = sinon.spy.create(-> if spy.callCount is 1 then throw error else throw new Error())

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.always.thrown(error)).to.throw(AssertionError)
            expect(-> spy.should.always.have.thrown(error)).to.throw(AssertionError)
            expect(-> spy.should.have.always.thrown("TypeError")).to.throw(AssertionError)
            expect(-> spy.should.always.have.thrown("TypeError")).to.throw(AssertionError)

        it "should not throw if the spy always throws the right error", ->
            spy = sinon.spy.create(-> throw error)

            swallow(spy)
            swallow(spy)

            expect(-> spy.should.have.always.thrown(error)).to.not.throw()
            expect(-> spy.should.always.have.thrown(error)).to.not.throw()
            expect(-> spy.should.have.always.thrown("TypeError")).to.not.throw()
            expect(-> spy.should.always.have.thrown("TypeError")).to.not.throw()
