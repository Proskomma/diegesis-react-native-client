import { Flex, Surface, Text } from "@react-native-material/core";
import { CheckIcon, Select } from "native-base";
import { StyleSheet } from "react-native";

export default function BookCodeSelector({
  label,
  bookcodes,
  bookCode,
  setBookCode,
}) {
  return (
    <Flex direction="row">
      <Text style={{ marginTop: 7 }}>
        {" "}
        {label} : {"\n"}
      </Text>
      <Select
        placeholder="Please Choose Book"
        selectedValue={bookCode}
        minWidth="200"
        mt={1}
        _selectedItem={{
          bg: "#d3d3d3",
          endIcon: <CheckIcon size="5" />,
        }}
      >
        {bookcodes.map((bc, n) => (
          <Select.Item
            key={n}
            value={bc}
            label={bc}
            onPress={() => setBookCode(bc)}
          ></Select.Item>
        ))}
      </Select>
    </Flex>
  );
}

const styles = StyleSheet.create({});
