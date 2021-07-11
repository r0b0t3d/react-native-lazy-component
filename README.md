# @r0b0t3d/react-native-lazy-component

✅ Your screen slow to load

✅ Your screen has a lot of heavy components but just use some at a time

👇
## Installation

```sh
yarn add @r0b0t3d/react-native-lazy-component
```

## Key features

✅ Lazy load component when needed

✅ Type checked

## Usage

#### Before 🙁

```js
import HeavyTab1 from './components/HeavyTab1'
import HeavyTab2 from './components/HeavyTab2'
import HeavyTab3 from './components/HeavyTab3'

export default function Screen() {
    const [currentTab, setCurrentTab] = useState('tab1')

    return (
        <View>
            {currentTab === 'tab1' && (
                <HeavyTab1 prop1={data1} props2={data2} />
            )}
            {currentTab === 'tab2' && <HeavyTab2 />}
            {currentTab === 'tab3' && <HeavyTab3 />}
        </View>
    )
}
```
#### After 😍

```js
import LazyComponent from "@r0b0t3d/react-native-lazy-component";

export default function Screen() {
    const [currentTab, setCurrentTab] = useState('tab1')

    return (
        <View>
            <LazyComponent
                visible={currentTab === 'tab1'}
                load={() => import('./components/HeavyTab1')} // or require('./components/HeavyTab1')
                prop1={data1}
                props2={data2}
            />
            <LazyComponent
                visible={currentTab === 'tab2'}
                load={() => import('./components/HeavyTab2')}
            />
            <LazyComponent
                visible={currentTab === 'tab3'}
                load={() => import('./components/HeavyTab3')}
            />
        </View>
    )
}
```

## Notes
1. If you'd like to use `import` instead of `require`, make sure update `tsconfig.json` to
```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
    }
}
```
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
