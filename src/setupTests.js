import 'jest-canvas-mock';
global.fetch = require("jest-fetch-mock");
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
const Enzyme = require("enzyme");
 const EnzymeAdapter = require("enzyme-adapter-react-16");  

// Setup enzyme's react adapter
 Enzyme.configure({ adapter: new EnzymeAdapter() });