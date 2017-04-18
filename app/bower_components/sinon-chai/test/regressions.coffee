"use strict"

sinon = require("sinon")

describe "Regressions", ->
    specify "GH-19: functions with `proxy` properties", ->
        func = ->
        func.proxy = 5

        spy = sinon.spy(func)
        spy()

        expect(-> spy.should.have.been.called).to.not.throw()
