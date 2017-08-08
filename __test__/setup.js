import Jsdom from 'jsdom'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

chai.use(chaiEnzyme())

global.document = Jsdom.jsdom('<body><div id="app"></div></body>')
global.window = document.defaultView
global.navigator = window.navigator
global.BASENAME = 'app';