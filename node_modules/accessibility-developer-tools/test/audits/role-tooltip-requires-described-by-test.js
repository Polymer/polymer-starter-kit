module('RoleTooltipRequiresDescribedBy');

test('role tooltip with a corresponding aria-describedby should pass', function() {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip1');
    deepEqual(
        axs.AuditRules.getRule('roleTooltipRequiresDescribedby').run({ scope: fixture }),
        { elements: [], result: axs.constants.AuditResult.PASS }
    );
});

test('role tooltip with multiple corresponding aria-describedby should pass', function() {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger1 = document.createElement('div');
    var trigger2 = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger1);
    fixture.appendChild(trigger2);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger1.setAttribute('aria-describedby', 'tooltip1');
    trigger2.setAttribute('aria-describedby', 'tooltip1');
    deepEqual(
        axs.AuditRules.getRule('roleTooltipRequiresDescribedby').run({ scope: fixture }),
        { elements: [], result: axs.constants.AuditResult.PASS }
    );
});

test('role tooltip without a aria-describedby should fail', function() {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    fixture.appendChild(tooltip);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    deepEqual(
        axs.AuditRules.getRule('roleTooltipRequiresDescribedby').run({ scope: fixture }),
        { elements: [tooltip], result: axs.constants.AuditResult.FAIL }
    );
});

test('role tooltip without a corresponding aria-describedby should fail', function() {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip2');
    deepEqual(
        axs.AuditRules.getRule('roleTooltipRequiresDescribedby').run({ scope: fixture }),
        { elements: [tooltip], result: axs.constants.AuditResult.FAIL }
    );
});

test('a hidden tooltip without a corresponding aria-describedby should not fail', function() {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('aria-hidden', true);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip2');
    deepEqual(
        axs.AuditRules.getRule('roleTooltipRequiresDescribedby').run({ scope: fixture }),
        { result: axs.constants.AuditResult.NA }
    );
});
