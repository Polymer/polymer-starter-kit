"use strict"

sinon = require("sinon")

describe "Messages", ->
    describe "about call count", ->
        it "should be correct for the base cases", ->
            spy = sinon.spy()

            expect(-> spy.should.have.been.called).to
                .throw("expected spy to have been called at least once, but it was never called")
            expect(-> spy.should.have.been.calledOnce).to
                .throw("expected spy to have been called exactly once, but it was called 0 times")
            expect(-> spy.should.have.been.calledTwice).to
                .throw("expected spy to have been called exactly twice, but it was called 0 times")
            expect(-> spy.should.have.been.calledThrice).to
                .throw("expected spy to have been called exactly thrice, but it was called 0 times")

            expect(-> spy.should.have.callCount(1)).to
                .throw("expected spy to have been called exactly once, but it was called 0 times")
            expect(-> spy.should.have.callCount(4)).to
                .throw("expected spy to have been called exactly 4 times, but it was called 0 times")

        it "should be correct for the negated cases", ->
            calledOnce = sinon.spy()
            calledTwice = sinon.spy()
            calledThrice = sinon.spy()
            calledFourTimes = sinon.spy()

            calledOnce()
            calledTwice()
            calledTwice()
            calledThrice()
            calledThrice()
            calledThrice()
            calledFourTimes()
            calledFourTimes()
            calledFourTimes()
            calledFourTimes()

            expect(-> calledOnce.should.not.have.been.called).to
                .throw("expected spy to not have been called")
            expect(-> calledOnce.should.not.have.been.calledOnce).to
                .throw("expected spy to not have been called exactly once")
            expect(-> calledTwice.should.not.have.been.calledTwice).to
                .throw("expected spy to not have been called exactly twice")
            expect(-> calledThrice.should.not.have.been.calledThrice).to
                .throw("expected spy to not have been called exactly thrice")

            expect(-> calledOnce.should.not.have.callCount(1)).to
                .throw("expected spy to not have been called exactly once")
            expect(-> calledFourTimes.should.not.have.callCount(4)).to
                .throw("expected spy to not have been called exactly 4 times")

    describe "about call order", ->
        it "should be correct for the base cases", ->
            spyA = sinon.spy()
            spyB = sinon.spy()

            spyA.displayName = "spyA"
            spyB.displayName = "spyB"

            expect(-> spyA.should.have.been.calledBefore(spyB)).to
                .throw("expected spyA to have been called before function spyB() {}")
            expect(-> spyB.should.have.been.calledAfter(spyA)).to
                .throw("expected spyB to have been called after function spyA() {}")

        it "should be correct for the negated cases", ->
            spyA = sinon.spy()
            spyB = sinon.spy()

            spyA.displayName = "spyA"
            spyB.displayName = "spyB"

            spyA()
            spyB()

            expect(-> spyA.should.not.have.been.calledBefore(spyB)).to
                .throw("expected spyA to not have been called before function spyB() {}")
            expect(-> spyB.should.not.have.been.calledAfter(spyA)).to
                .throw("expected spyB to not have been called after function spyA() {}")

    describe "about call context", ->
        it "should be correct for the basic case", ->
            spy = sinon.spy()
            context = {}
            badContext = { x: "y" }

            spy.call(badContext)

            expected = "expected spy to have been called with {  } as this, but it was called with " +
                spy.printf("%t") + " instead"
            expect(-> spy.should.have.been.calledOn(context)).to.throw(expected)
            expect(-> spy.getCall(0).should.have.been.calledOn(context)).to.throw(expected)

        it "should be correct for the negated case", ->
            spy = sinon.spy()
            context = {}

            spy.call(context)

            expected = "expected spy to not have been called with {  } as this"
            expect(-> spy.should.not.have.been.calledOn(context)).to.throw(expected)
            expect(-> spy.getCall(0).should.not.have.been.calledOn(context)).to.throw(expected)

        it "should be correct for the always case", ->
            spy = sinon.spy()
            context = {}
            badContext = { x: "y" }

            spy.call(badContext)

            expected = "expected spy to always have been called with {  } as this, but it was called with " +
                spy.printf("%t") + " instead"
            expect(-> spy.should.always.have.been.calledOn(context)).to.throw(expected)

    describe "about calling with new", ->
        it "should be correct for the basic case", ->
            spy = sinon.spy()

            spy()

            expected = "expected spy to have been called with new"
            expect(-> spy.should.have.been.calledWithNew).to.throw(expected)
            expect(-> spy.getCall(0).should.have.been.calledWithNew).to.throw(expected)

        it "should be correct for the negated case", ->
            spy = sinon.spy()

            new spy()

            expected = "expected spy to not have been called with new"
            expect(-> spy.should.not.have.been.calledWithNew).to.throw(expected)
            expect(-> spy.getCall(0).should.not.have.been.calledWithNew).to.throw(expected)

        it "should be correct for the always case", ->
            spy = sinon.spy()

            new spy()
            spy()

            expected = "expected spy to always have been called with new"
            expect(-> spy.should.always.have.been.calledWithNew).to.throw(expected)

    describe "about call arguments", ->
        it "should be correct for the basic cases", ->
            spy = sinon.spy()

            spy(1, 2, 3)

            expect(-> spy.should.have.been.calledWith("a", "b", "c")).to
                .throw("expected spy to have been called with arguments a, b, c\n    spy(1, 2, 3)")
            expect(-> spy.should.have.been.calledWithExactly("a", "b", "c")).to
                .throw("expected spy to have been called with exact arguments a, b, c\n    spy(1, 2, 3)")
            expect(-> spy.should.have.been.calledWithMatch(sinon.match("foo"))).to
                .throw("expected spy to have been called with arguments matching match(\"foo\")\n    spy(1, 2, 3)")

            expect(-> spy.getCall(0).should.have.been.calledWith("a", "b", "c")).to
                .throw("expected spy to have been called with arguments a, b, c\n    spy(1, 2, 3)")
            expect(-> spy.getCall(0).should.have.been.calledWithExactly("a", "b", "c")).to
                .throw("expected spy to have been called with exact arguments a, b, c\n    spy(1, 2, 3)")
            expect(-> spy.getCall(0).should.have.been.calledWithMatch(sinon.match("foo"))).to
                .throw("expected spy to have been called with arguments matching match(\"foo\")\n    spy(1, 2, 3)")

        it "should be correct for the negated cases", ->
            spy = sinon.spy()

            spy(1, 2, 3)

            expect(-> spy.should.not.have.been.calledWith(1, 2, 3)).to
                .throw("expected spy to not have been called with arguments 1, 2, 3")
            expect(-> spy.should.not.have.been.calledWithExactly(1, 2, 3)).to
                .throw("expected spy to not have been called with exact arguments 1, 2, 3")
            expect(-> spy.should.not.have.been.calledWithMatch(sinon.match(1))).to
                .throw("expected spy to not have been called with arguments matching match(1)")

            expect(-> spy.getCall(0).should.not.have.been.calledWith(1, 2, 3)).to
                .throw("expected spy to not have been called with arguments 1, 2, 3")
            expect(-> spy.getCall(0).should.not.have.been.calledWithExactly(1, 2, 3)).to
                .throw("expected spy to not have been called with exact arguments 1, 2, 3")
            expect(-> spy.getCall(0).should.not.have.been.calledWithMatch(sinon.match(1))).to
                .throw("expected spy to not have been called with arguments matching match(1)")

        it "should be correct for the always cases", ->
            spy = sinon.spy()

            spy(1, 2, 3)
            spy("a", "b", "c")

            expected = "expected spy to always have been called with arguments 1, 2, 3\n    spy(1, 2, 3)\n" +
                "    spy(a, b, c)"
            expect(-> spy.should.always.have.been.calledWith(1, 2, 3)).to.throw(expected)

            expectedExactly = "expected spy to always have been called with exact arguments 1, 2, 3\n" +
                "    spy(1, 2, 3)\n    spy(a, b, c)"
            expect(-> spy.should.always.have.been.calledWithExactly(1, 2, 3)).to
                .throw(expectedExactly)

            expectedMatch = "expected spy to always have been called with arguments matching match(1)\n" +
                "    spy(1, 2, 3)\n    spy(a, b, c)"
            expect(-> spy.should.always.have.been.calledWithMatch(sinon.match(1))).to
                .throw(expectedMatch)

    describe "about returning", ->
        it "should be correct for the basic case", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.have.returned(2)).to.throw("expected spy to have returned 2")
            expect(-> spy.getCall(0).should.have.returned(2)).to.throw("expected spy to have returned 2")

        it "should be correct for the negated case", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.not.have.returned(1)).to.throw("expected spy to not have returned 1")
            expect(-> spy.getCall(0).should.not.have.returned(1)).to.throw("expected spy to not have returned 1")

        it "should be correct for the always case", ->
            spy = sinon.spy.create(-> 1)

            spy()

            expect(-> spy.should.always.have.returned(2)).to.throw("expected spy to always have returned 2")

    describe "about throwing", ->
        it "should be correct for the basic cases", ->
            spy = sinon.spy()
            throwingSpy = sinon.spy.create(-> throw new Error())

            spy()
            swallow(throwingSpy)

            expect(-> spy.should.have.thrown()).to.throw("expected spy to have thrown")
            expect(-> spy.getCall(0).should.have.thrown()).to.throw("expected spy to have thrown")

            expect(-> throwingSpy.should.have.thrown("TypeError")).to.throw("expected spy to have thrown TypeError")
            expect(-> throwingSpy.getCall(0).should.have.thrown("TypeError")).to
                .throw("expected spy to have thrown TypeError")

            expect(-> throwingSpy.should.have.thrown({ message: "x" })).to
                .throw('expected spy to have thrown { message: "x" }')
            expect(-> throwingSpy.getCall(0).should.have.thrown({ message: "x" })).to
                .throw('expected spy to have thrown { message: "x" }')

        it "should be correct for the negated cases", ->
            error = new Error("boo!")
            spy = sinon.spy.create(-> throw error)

            swallow(spy)

            expect(-> spy.should.not.have.thrown()).to.throw("expected spy to not have thrown")
            expect(-> spy.getCall(0).should.not.have.thrown()).to.throw("expected spy to not have thrown")

            expect(-> spy.should.not.have.thrown("Error")).to.throw("expected spy to not have thrown Error")
            expect(-> spy.getCall(0).should.not.have.thrown("Error")).to.throw("expected spy to not have thrown Error")

            expect(-> spy.should.not.have.thrown(error)).to
                .throw("expected spy to not have thrown Error: boo!")
            expect(-> spy.getCall(0).should.not.have.thrown(error)).to
                .throw("expected spy to not have thrown Error: boo!")

        it "should be correct for the always cases", ->
            spy = sinon.spy()
            throwingSpy = sinon.spy.create(-> throw new Error())

            spy()
            swallow(throwingSpy)

            expect(-> spy.should.have.always.thrown()).to
                .throw("expected spy to always have thrown")

            expect(-> throwingSpy.should.have.always.thrown("TypeError")).to
                .throw("expected spy to always have thrown TypeError")

            expect(-> throwingSpy.should.have.always.thrown({ message: "x" })).to
                .throw('expected spy to always have thrown { message: "x" }')

    describe "when used on a non-spy/non-call", ->
        notSpy = ->

        it "should be informative for properties", ->
            expect(-> notSpy.should.have.been.called).to.throw(TypeError, /not a spy/)

        it "should be informative for methods", ->
            expect(-> notSpy.should.have.been.calledWith("foo")).to.throw(TypeError, /not a spy/)

    it "should not trigger getters for passing assertions", ->
        obj = {}
        getterCalled = false
        Object.defineProperty(obj, "getter", {
            get: -> getterCalled = true
            enumerable: true
        })

        spy = sinon.spy()

        spy(obj)

        spy.should.have.been.calledWith(obj)

        expect(getterCalled).to.be.false
