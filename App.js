import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {primary: '#1f145c', white: '#fff'};

const ListItem = ({todo, deleteTodo, markCompleteTodo}) => {
  return (
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: COLORS.primary,
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
          }}>
          {todo?.text}
        </Text>
      </View>
      {!todo?.completed && (
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => markCompleteTodo(todo.id)}>
          <Icon name="done" color="green" size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.actionIcon}
        onPress={() => deleteTodo(todo.id)}>
        <Icon name="delete" color="red" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    const saveTodosToUserDevice = async () => {
      try {
        await AsyncStorage.setItem('myTodos', JSON.stringify(todos));
      } catch (e) {
        console.log(e);
      }
    };
    saveTodosToUserDevice();
  }, [todos]);

  React.useEffect(() => {
    const getTodosFromUserDevice = async () => {
      try {
        const todosFromDevice = await AsyncStorage.getItem('myTodos');
        todosFromDevice && setTodos(JSON.parse(todosFromDevice));
      } catch (e) {
        console.log(e);
      }
    };
    getTodosFromUserDevice();
  }, []);

  const addTodo = () => {
    if (textInput === '') {
      Alert.alert('Error', 'Please fill input');
      return;
    }
    const todo = {
      id: Math.random(),
      text: textInput,
      completed: false,
    };

    setTodos(prev => {
      return [...prev, todo];
    });
    setTextInput('');
  };

  const deleteTodo = id => {
    const filteredTodo = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodo);
  };

  const markCompleteTodo = id => {
    const newTodo = todos.map(item => {
      if (item.id === id) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodo);
  };

  const clearAllTodos = () => {
    Alert.alert('Delete', 'Delete all todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {text: 'No'},
    ]);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TODO APP</Text>
        <Icon name="delete" color="red" size={25} onPress={clearAllTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => (
          <ListItem
            todo={item}
            deleteTodo={deleteTodo}
            markCompleteTodo={markCompleteTodo}
          />
        )}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="ADD TODO"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" size={25} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  inputContainer: {
    backgroundColor: COLORS.primary,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },

  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default App;
