import 'raf/polyfill';
import 'jest-styled-components';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import serializer from 'enzyme-to-json/serializer';

Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(serializer);
