# react-native-in-port

Use LightHouse and Ship to detect if a children component is inside the (View)port.

## Installation

```sh
npm install react-native-in-port
```

## Example
| Example  |
| ------------- |
| <video src="https://github.com/WayneKim92/react-native-in-port/assets/75321423/24eb55c6-abbe-410e-a363-c179f17a9c9d">  |


```js
const ScrollViewExample = () => {
  return (
    // LightHouse's child component can only be ScrollView or FlatList.
    // When scroll and focus events occur, LightHouse asks the Ship if it is within a (view)port.
    // throttleTime: dafault === 500
    <LightHouse throttleTime={100}>
      <ScrollView style={styles.scrollView} scrollEventThrottle={1}>
        {colors.map((color, index) => (
          <Ship
            key={index}
            detectPercent={50}
            // Adjust the detection condition by adjusting the viewport area.
            viewportMargin={{ top: headerHeight, bottom: 70 }}
            onPort={(state) => {
              // You may call the tracking API in this part.
              // --------------------------------------------
              // await analytics().logEvent('viewed', {
              //   useId: 3745092,
              //   description: 'User viewed an ad space.',
              // })
              // --------------------------------------------

              const { isInPort, inPortCount } = state;

              // Return values can be passed as child props.
              return {
                nextProps: { backgroundColor: isInPort ? 'gray' : color },
                isValidInPort: inPortCount < 1,
              };
            }}
          >
            <Box backgroundColor={color} />
          </Ship>
        ))}
      </ScrollView>
    </LightHouse>
  );
};
```
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
