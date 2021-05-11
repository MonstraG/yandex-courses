/* global describe, it, global */

require('should');

const tags = require('./getUniqTags');

describe('Кол-во тегов.', function (){
    it('Должно быть не менее уникальных 5 тегов.', function () {
        tags.length.should.be.aboveOrEqual(5);
    });
});
