import React from 'react';
import ReactAddons from 'react/addons';
import stubRouterContext from './utils/stubRouterContext';
import Header from 'client/app/common/header';

var testUtils = ReactAddons.addons.TestUtils;

describe("Header", function () {
    var HeaderWrapper, header;
    beforeEach(function () {
        HeaderWrapper = stubRouterContext(Header);
        header = testUtils.renderIntoDocument(<HeaderWrapper />);
    });
    it("should exist", function () {
        expect(header).toBeDefined();
    });
    it("nav should have 2 tabs", function () {
        expect(header.getDOMNode().querySelectorAll('ul li').length).toEqual(2);
    });
});
