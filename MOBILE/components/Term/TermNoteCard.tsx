import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import { useStudy } from '@/context/StudyProvider';
import { usePreferences } from '@/context/PreferencesProvider';
import { CARD_SHADOW } from './WordPartsCard';

interface Props {
  termId: number;
}

// A personal note on a term, saved on this device.
export const TermNoteCard: React.FC<Props> = ({ termId }) => {
  const { notes, saveNote } = useStudy();
  const { isDark } = usePreferences();
  const saved = notes[String(termId)]?.text ?? '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(saved);

  useEffect(() => { if (!editing) setDraft(saved); }, [saved, editing]);

  const save = () => {
    saveNote(termId, draft);
    setEditing(false);
  };

  return (
    <S.View className="mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4" style={CARD_SHADOW}>
      <S.View className="flex-row items-center">
        <S.View className="h-11 w-11 rounded-xl items-center justify-center bg-blue-50 dark:bg-slate-800">
          <MaterialCommunityIcons name="square-edit-outline" size={22} color={isDark ? '#93c5fd' : '#1d4ed8'} />
        </S.View>
        <S.View className="flex-1 ml-3">
          <S.Text className="text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300">My note</S.Text>
          {!editing && (
            <S.Text className={`text-sm font-pregular mt-0.5 ${saved ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
              {saved || 'Write something to help you remember this term.'}
            </S.Text>
          )}
        </S.View>
        {!editing && (
          <S.TouchableOpacity
            onPress={() => setEditing(true)}
            className="ml-3 px-4 py-2 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700"
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Edit my note' : 'Add a note'}
          >
            <S.Text className="text-sm font-psemibold text-blue-700 dark:text-blue-300">{saved ? 'Edit' : '+ Add'}</S.Text>
          </S.TouchableOpacity>
        )}
      </S.View>

      {editing && (
        <S.View className="mt-3">
          <S.TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            autoFocus
            placeholder="e.g. myo = muscle, like “my own muscles”"
            placeholderTextColor={isDark ? '#64748b' : '#9CA3AF'}
            className="min-h-[90px] rounded-xl border border-blue-300 dark:border-slate-600 bg-blue-50 dark:bg-slate-800 p-3 text-base font-pregular text-slate-800 dark:text-slate-100"
            style={{ textAlignVertical: 'top' }}
            accessibilityLabel="Note text"
          />
          <S.View className="flex-row justify-end mt-3">
            <S.TouchableOpacity onPress={() => { setDraft(saved); setEditing(false); }} className="px-4 py-2 mr-2" accessibilityRole="button">
              <S.Text className="font-psemibold text-slate-500 dark:text-slate-400">Cancel</S.Text>
            </S.TouchableOpacity>
            <S.TouchableOpacity onPress={save} className="px-5 py-2 rounded-lg bg-blue-700" accessibilityRole="button" accessibilityLabel="Save note">
              <S.Text className="font-pbold text-white">Save</S.Text>
            </S.TouchableOpacity>
          </S.View>
        </S.View>
      )}
    </S.View>
  );
};
