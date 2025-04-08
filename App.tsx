import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity, Platform } from 'react-native';

type Reminder = {
  id: string;
  text: string;
  time: string;
  alarmTime: string | null;
};

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [alarmTime, setAlarmTime] = useState('');

  const addReminder = () => {
    // Validasi kedua field harus terisi
    if (!inputValue.trim() || !alarmTime.trim()) {
      return;
    }

    // Validasi format jam HH:MM
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(alarmTime)) {
      alert('Format jam harus HH:MM');
      return;
    }

    // Set alarm
    const [hours, minutes] = alarmTime.split(':').map(Number);
    const now = new Date();
    const alarmDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    
    const diff = alarmDate.getTime() - now.getTime();
    if (diff > 0) {
      setTimeout(() => {
        alert(`ALARM: ${inputValue}`);
      }, diff);
    }
    
    setReminders([...reminders, { 
      id: Date.now().toString(), 
      text: inputValue,
      time: alarmTime, // Gunakan waktu yang diinput user
      alarmTime: alarmTime
    }]);
    setInputValue('');
    setAlarmTime('');
  };

  const handleKeyPress = (e: any, field: string) => {
    if (e.nativeEvent.key === 'Enter') {
      // Jika menekan Enter di field reminder, pindah ke field waktu
      if (field === 'reminder' && inputValue.trim() && !alarmTime.trim()) {
        // Focus ke field waktu
        return;
      }
      // Jika menekan Enter di field waktu atau kedua field terisi, submit
      if ((field === 'time' || (inputValue.trim() && alarmTime.trim()))) {
        addReminder();
      }
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const clearAllReminders = () => {
    if (reminders.length > 0) {
      setReminders([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {Platform.OS === 'web' ? 'Reminder App (Web)' : 'Reminder App (Mobile)'}
      </Text>
      
      {reminders.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearAllReminders}
        >
          <Text style={styles.clearButtonText}>Hapus Semua</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan reminder"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={(e) => handleKeyPress(e, 'reminder')}
            returnKeyType={alarmTime.trim() ? 'done' : 'next'}
          />
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="HH:MM"
            value={alarmTime}
            onChangeText={(text) => {
              // Format otomatis dengan titik dua
              if (text.length === 2 && !text.includes(':')) {
                setAlarmTime(text + ':');
              } else {
                setAlarmTime(text);
              }
            }}
            onSubmitEditing={(e) => handleKeyPress(e, 'time')}
            keyboardType="numeric"
            maxLength={5}
            returnKeyType="done"
          />
        <Button title="Tambah" onPress={addReminder} />
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Text style={styles.reminderText}>{item.text}</Text>
            <Text style={styles.reminderTime}>
              ⏰ {item.time}
            </Text>
            <TouchableOpacity onPress={() => deleteReminder(item.id)}>
              <Text style={styles.deleteButton}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    default: {
      flex: 1,
      padding: 20,
      backgroundColor: '#CCCCFF'
    },
    web: {
      flex: 1,
      padding: 20,
      backgroundColor: '#CCCCFF',
      height: '100%',
      width: '100%'
    }
  }),
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    ...Platform.select({
      web: {
        userSelect: 'none' as const
      }
    })
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    ...Platform.select({
      web: {
        userSelect: 'none' as const
      }
    })
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    })
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    ...Platform.select({
      web: {
        userSelect: 'none' as const,
        cursor: undefined
      }
    })
  },
  reminderText: {
    fontSize: 16,
    flex: 1,
    ...Platform.select({
      web: {
        userSelect: 'none' as const
      }
    })
  },
  reminderTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
    ...Platform.select({
      web: {
        userSelect: 'none' as const
      }
    })
  },
  timeInput: {
    width: 100,
    marginLeft: 10
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    ...Platform.select({
      web: {
        cursor: undefined,
        userSelect: 'none' as const
      }
    })
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none' as const
      }
    })
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
