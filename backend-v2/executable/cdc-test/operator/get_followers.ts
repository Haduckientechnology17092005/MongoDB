import {Operator} from '../pipeline';
import {Source} from '../source';
import {Sink} from '../sink';
import User from '../../../internal/model/user';
import _ from 'lodash';
class GetFollowers implements Operator {
  source: Source;
  sink: Sink;
  constructor(source: Source, sink: Sink) {
    this.source = source;
    this.sink = sink;
  }
  async run(data: any): Promise<any> {
    if(data.operationType === 'insert') {
      const authorId = _.get(data, 'fullDocument.author');
      const author = await User.findById(authorId);
      const followers = await _.get(author, 'followers', []).map((follower) => follower.toString());
      return {
        sinkData: {
          ...data,
          followers,
        },
      };
    }
    return null;
  }
}
export {
  GetFollowers,
};