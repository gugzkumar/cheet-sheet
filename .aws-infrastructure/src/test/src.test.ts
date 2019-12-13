import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Src = require('../lib/src-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Src.SrcStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});