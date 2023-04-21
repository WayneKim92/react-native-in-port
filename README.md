# react-native-in-port

Use LightHouse and Ship to detect if a children component is inside the (View)port.

## Installation

```sh
npm install react-native-in-port
```

## Example

<div align="center">
  <video src="https://user-images.githubusercontent.com/75321423/233711305-2c144676-641c-49c3-97ec-0705dd04195a.mov"></video>
</div>

```js
const ScrollViewExample = () => {
  return (
    // LightHouse's child component can only be ScrollView or FlatList.
    // When scroll and focus events occur, LightHouse asks the Ship if it is within a (view)port.
    <LightHouse>
      <ScrollView>
        {colors.map((color, index) => (
          <Ship
            key={index}

            // Detects when a child component is completely contained within the viewport.
            detectType={'completely'} // or incompletely

            // Detect based on the specific orientation of the component.
            detectDirection={'vertical'} // or both | horizontal

            // Adjust the detection condition by adjusting the viewport area.
            viewportMargin={{ top: 100, bottom: 100, left: 100}}

            onPort={(isIn) => {
              // You may call the tracking API in this part.
              // --------------------------------------------
              // await analytics().logEvent('viewed', {
              //   useId: 3745092,
              //   description: 'User viewed an ad space.',
              // })
              // --------------------------------------------

              // Return values can be passed as child props.
              return { backgroundColor: isIn ? 'black' : color };
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
