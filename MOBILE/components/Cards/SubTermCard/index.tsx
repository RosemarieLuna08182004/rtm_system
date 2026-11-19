// import { SFC, SubTermCardProps } from '@/types';
// import * as S from '../../../styles';
// import React, { useMemo } from 'react';
// import RenderHTML from 'react-native-render-html';
// import { StyleSheet, useWindowDimensions } from 'react-native';
// import ImageZoomViewer from '@/components/ImageZoomViewer';

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   text: { color: '#334155', fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_400Regular' },
//   paragraph: { marginTop: 0, marginBottom: 0, fontFamily: 'Poppins_400Regular' },
//   list: { marginTop: 4, marginBottom: 0, paddingLeft: 26, fontFamily: 'Poppins_400Regular' },
//   listItem: { marginBottom: 0, flexDirection: 'row', alignItems: 'flex-start', fontFamily: 'Poppins_400Regular' },
//   bullet: { width: 18, textAlign: 'right', marginRight: 8, color: '#334155', fontFamily: 'Poppins_400Regular' },
//   nestedList: { marginTop: 6, paddingLeft: 12, fontFamily: 'Poppins_400Regular' },
//   bold: { fontFamily: 'Poppins_700Bold' },
//   italic: { fontFamily: 'Poppins_400Regular_Italic' },
//   underline: { textDecorationLine: 'underline', fontFamily: 'Poppins_400Regular' },
//   link: { color: '#1d4ed8', textDecorationLine: 'underline', fontFamily: 'Poppins_500Medium' },
//   h1: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_700Bold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
//   h2: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_700Bold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
//   h3: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_600SemiBold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
//   blockquote: {
//     backgroundColor: '#eff6ff',
//     borderLeftWidth: 4,
//     borderLeftColor: '#1d4ed8',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginVertical: 8,
//     fontFamily: 'Poppins_400Regular_Italic'
//   },
//   codeInline: {
//     backgroundColor: '#e2e8f0',
//     color: '#0f172a',
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: 4,
//     fontFamily: 'Courier',
//     fontSize: 14,
//   },
//   preContainer: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10, marginVertical: 8 },
//   preText: { color: '#e5e7eb', fontFamily: 'Courier', fontSize: 14, lineHeight: 20 },
//   hr: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
// });

// function sanitizeHtml(html?: string) {
//   if (!html) return '';
//   let cleaned = html
//     .replace(/class="[^"]*"/gi, '')
//     .replace(/,(?![^()]*\))/g, '<span class="nobr-comma">,</span>')
//     .replace(/(<\/(?:strong|em|i|b|u)>)(?=<(?:strong|em|i|b|u|p|span))/gi, '$1 ')
//     .replace(/(<\/(?:strong|em|i|b|u)>)(?=[A-Za-z(])/gi, '$1 ')
//     .replace(/<\/p>\s*<p>/gi, '</p>\n<p>')
//     .replace(/&nbsp;/g, ' ')
//     .replace(/\s{2,}/g, ' ');
//   const result = cleaned
//     .replace(/(<\/\w+>)\s*<br\s*\/?>/gi, '$1')
//     .replace(/<br\s*\/?>\s*<\/p>/gi, '</p>')
//     .replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>')
//     .replace(/<p[^>]*>/gi, '<p>')
//     .replace(/<\/p>/gi, '</p>')
//     .trim();
//   return result;
// }

// export const HTMLContent = ({ html }) => {
//   const { width } = useWindowDimensions();
//   const cleanHtml = useMemo(() => sanitizeHtml(html), [html]);
//   const source = useMemo(() => ({ html: `<div>${cleanHtml}</div>` }), [cleanHtml]);

//   const baseTextStyle = {
//     fontFamily: 'Poppins_400Regular',
//     color: '#000000',
//     fontSize: 14,
//     lineHeight: 18,
//     textAlign: 'left' as const
//   };

//   const tagsStyles = useMemo(
//     () => ({
//       body: { ...baseTextStyle },
//       p: { ...baseTextStyle, marginBottom: 4, marginTop: 2 },
//       ul: { ...styles.list, marginBottom: 4, paddingLeft: 16 },
//       ol: { ...styles.list, marginBottom: 4, paddingLeft: 16 },
//       li: { ...baseTextStyle, marginBottom: 2, paddingLeft: 8 },

//       strong: { ...baseTextStyle, fontFamily: 'Poppins_700Bold', marginRight: 2 },
//       b: { ...baseTextStyle, fontFamily: 'Poppins_700Bold', marginRight: 2 },
//       em: { ...baseTextStyle, fontFamily: 'Poppins_400Regular_Italic', marginRight: 2 },
//       i: { ...baseTextStyle, fontFamily: 'Poppins_400Regular_Italic', marginRight: 2 },

//       // ✅ Bold + Italic combinations
//       'strong em': { ...baseTextStyle, fontFamily: 'Poppins_700Bold_Italic' },
//       'em strong': { ...baseTextStyle, fontFamily: 'Poppins_700Bold_Italic' },
//       'b i': { ...baseTextStyle, fontFamily: 'Poppins_700Bold_Italic' },
//       'i b': { ...baseTextStyle, fontFamily: 'Poppins_700Bold_Italic' },

//       // ✅ Automatic underline
//       u: { textDecorationLine: 'underline' as const },

//       a: { ...styles.link },
//       h1: { ...styles.h1 },
//       h2: { ...styles.h2 },
//       h3: { ...styles.h3 },
//       h4: { ...baseTextStyle, fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
//       h5: { ...baseTextStyle, fontFamily: 'Poppins_500Medium', fontSize: 14 },
//       h6: { ...baseTextStyle, fontFamily: 'Poppins_500Medium', fontSize: 14 },
//       blockquote: { ...styles.blockquote },
//       code: { ...styles.codeInline },
//       pre: { ...styles.preContainer },
//       hr: styles.hr,
//       span: { ...baseTextStyle },
//       'span.nobr-comma': { ...baseTextStyle, flexShrink: 0, paddingHorizontal: 1 },
//       div: { ...styles.container },
//     }),
//     [baseTextStyle]
//   );

//   const systemFonts = [
//     'Poppins_100Thin',
//     'Poppins_100Thin_Italic',
//     'Poppins_200ExtraLight',
//     'Poppins_200ExtraLight_Italic',
//     'Poppins_300Light',
//     'Poppins_300Light_Italic',
//     'Poppins_400Regular',
//     'Poppins_400Regular_Italic',
//     'Poppins_500Medium',
//     'Poppins_500Medium_Italic',
//     'Poppins_600SemiBold',
//     'Poppins_600SemiBold_Italic',
//     'Poppins_700Bold',
//     'Poppins_700Bold_Italic',
//     'Poppins_800ExtraBold',
//     'Poppins_800ExtraBold_Italic',
//     'Poppins_900Black',
//     'Poppins_900Black_Italic'
//   ];

//   return (
//     <RenderHTML
//       contentWidth={width - 24}
//       source={source}
//       tagsStyles={tagsStyles}
//       baseStyle={{ ...styles.text }}
//       systemFonts={systemFonts}
//       enableExperimentalBRCollapsing
//     />
//   );
// };

// export const SubTermCard: SFC<SubTermCardProps> = ({
//   ClassName,
//   Id,
//   Term,
//   Description,
//   IsBorderLeft = false,
//   Illustration = null,
// }) => {
//   const TermName = useMemo(() => Term?.trim() ?? '', [Term]);
//   const Descriptions = useMemo(() => Description?.trim() ?? '', [Description]);
//   const containerClass = IsBorderLeft
//     ? 'p-3 border-l-[5px] border-blue-700 px-2'
//     : 'bg-blue-100 rounded-lg';

//   return (
//     <S.View className={ClassName} key={Id}>
//       <S.View className="mb-2">
//         <S.View className="relative h-fit">
//           {TermName && (
//             <S.View className="w-full mb-2 flex justify-start items-start">
//               <S.Text className="text-md text-slate-600 font-psemibold">{TermName}</S.Text>
//             </S.View>
//           )}
//           {Descriptions && (
//             <S.View className={`w-full ${containerClass}`}>
//               {Illustration && (
//                 <ImageZoomViewer images={[{ uri: Illustration }]} imageIndex={0}>
//                   <S.View className="w-full my-2">
//                     <S.Image
//                       source={{ uri: Illustration }}
//                       className="w-full h-40 rounded-md"
//                       resizeMode="contain"
//                     />
//                   </S.View>
//                 </ImageZoomViewer>
//               )}
//               <S.View className={IsBorderLeft ? 'pl-3' : 'p-3 pl-4'}>
//                 <HTMLContent html={Descriptions} />
//               </S.View>
//             </S.View>
//           )}
//         </S.View>
//       </S.View>
//     </S.View>
//   );
// };

import { SFC, SubTermCardProps } from '@/types';
import * as S from '../../../styles';
import React, { useMemo } from 'react';
import RenderHTML from 'react-native-render-html';
import { StyleSheet, useWindowDimensions } from 'react-native';
import ImageZoomViewer from '@/components/ImageZoomViewer';

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { color: '#334155', fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_400Regular' },
  paragraph: { marginTop: 0, marginBottom: 0, fontFamily: 'Poppins_400Regular' },
  list: { marginTop: 4, marginBottom: 0, paddingLeft: 26, fontFamily: 'Poppins_400Regular' },
  listItem: { marginBottom: 0, flexDirection: 'row', alignItems: 'flex-start', fontFamily: 'Poppins_400Regular' },
  bullet: { width: 18, textAlign: 'right', marginRight: 8, color: '#334155', fontFamily: 'Poppins_400Regular' },
  nestedList: { marginTop: 6, paddingLeft: 12, fontFamily: 'Poppins_400Regular' },
  bold: { fontFamily: 'Poppins_700Bold' },
  italic: { fontFamily: 'Poppins_400Regular_Italic' },
  underline: { textDecorationLine: 'underline', fontFamily: 'Poppins_400Regular' },
  link: { color: '#1d4ed8', textDecorationLine: 'underline', fontFamily: 'Poppins_500Medium' },
  h1: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_700Bold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
  h2: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_700Bold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
  h3: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins_600SemiBold', color: '#0f172a', marginTop: 4, marginBottom: 0 },
  blockquote: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1d4ed8',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 8,
    fontFamily: 'Poppins_400Regular_Italic'
  },
  codeInline: {
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Courier',
    fontSize: 14,
  },
  preContainer: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10, marginVertical: 8 },
  preText: { color: '#e5e7eb', fontFamily: 'Courier', fontSize: 14, lineHeight: 20 },
  hr: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
});

function sanitizeHtml(html?: string) {
  if (!html) return '';

  // 1) Strip any incoming classes; 2) do our normal cleanup; 3) then inject our own helper classes
  let cleaned = html
    .replace(/class="[^"]*"/gi, '') // remove incoming classes
    // keep your comma-nobr spans
    .replace(/,(?![^()]*\))/g, '<span class="nobr-comma">,</span>')
    // whitespace & paragraph fixes
    .replace(/(<\/(?:strong|em|i|b|u)>)(?=<(?:strong|em|i|b|u|p|span))/gi, '$1 ')
    .replace(/(<\/(?:strong|em|i|b|u)>)(?=[A-Za-z(])/gi, '$1 ')
    .replace(/<\/p>\s*<p>/gi, '</p>\n<p>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ');

  // Convert nested bold+italic into a single span with __bi class
  // <strong><em>... </em></strong> or <em><strong>...</strong></em> and b/i variants
  cleaned = cleaned
    .replace(/<(strong|b)>\s*<(em|i)>([\s\S]*?)<\/\2>\s*<\/\1>/gi, '<span class="__bi">$3</span>')
    .replace(/<(em|i)>\s*<(strong|b)>([\s\S]*?)<\/\2>\s*<\/\1>/gi, '<span class="__bi">$3</span>');

  // Final normalization
  const result = cleaned
    .replace(/(<\/\w+>)\s*<br\s*\/?>/gi, '$1')
    .replace(/<br\s*\/?>\s*<\/p>/gi, '</p>')
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>')
    .replace(/<p[^>]*>/gi, '<p>')
    .replace(/<\/p>/gi, '</p>')
    .trim();

  return result;
}

export const HTMLContent = ({ html }) => {
  const { width } = useWindowDimensions();
  const cleanHtml = useMemo(() => sanitizeHtml(html), [html]);
  const source = useMemo(() => ({ html: `<div>${cleanHtml}</div>` }), [cleanHtml]);

  const baseTextStyle = {
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'left' as const
  };

  const tagsStyles = useMemo(
    () => ({
      body: { ...baseTextStyle },
      p: { ...baseTextStyle, marginBottom: 4, marginTop: 2 },
      ul: { ...styles.list, marginBottom: 4, paddingLeft: 16 },
      ol: { ...styles.list, marginBottom: 4, paddingLeft: 16 },
      li: { ...baseTextStyle, marginBottom: 2, paddingLeft: 8 },

      // single styles
      strong: { ...baseTextStyle, fontFamily: 'Poppins_700Bold', marginRight: 2 },
      b: { ...baseTextStyle, fontFamily: 'Poppins_700Bold', marginRight: 2 },
      em: { ...baseTextStyle, fontFamily: 'Poppins_400Regular_Italic', marginRight: 2 },
      i: { ...baseTextStyle, fontFamily: 'Poppins_400Regular_Italic', marginRight: 2 },

      // underline is additive
      u: { textDecorationLine: 'underline' as const },

      a: { ...styles.link },
      h1: { ...styles.h1 },
      h2: { ...styles.h2 },
      h3: { ...styles.h3 },
      h4: { ...baseTextStyle, fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
      h5: { ...baseTextStyle, fontFamily: 'Poppins_500Medium', fontSize: 14 },
      h6: { ...baseTextStyle, fontFamily: 'Poppins_500Medium', fontSize: 14 },
      blockquote: { ...styles.blockquote },
      code: { ...styles.codeInline },
      pre: { ...styles.preContainer },
      hr: styles.hr,
      span: { ...baseTextStyle },
      div: { ...styles.container },
    }),
    [baseTextStyle]
  );

  // Class-based styles (works reliably with react-native-render-html)
  const classesStyles = useMemo(
    () => ({
      '__bi': { fontFamily: 'Poppins_700Bold_Italic' }, // our bold+italic combo
      'nobr-comma': { flexShrink: 0, paddingHorizontal: 1 },
    }),
    []
  );

  const systemFonts = [
    'Poppins_100Thin',
    'Poppins_100Thin_Italic',
    'Poppins_200ExtraLight',
    'Poppins_200ExtraLight_Italic',
    'Poppins_300Light',
    'Poppins_300Light_Italic',
    'Poppins_400Regular',
    'Poppins_400Regular_Italic',
    'Poppins_500Medium',
    'Poppins_500Medium_Italic',
    'Poppins_600SemiBold',
    'Poppins_600SemiBold_Italic',
    'Poppins_700Bold',
    'Poppins_700Bold_Italic',
    'Poppins_800ExtraBold',
    'Poppins_800ExtraBold_Italic',
    'Poppins_900Black',
    'Poppins_900Black_Italic'
  ];

  return (
    <RenderHTML
      contentWidth={width - 24}
      source={source}
      tagsStyles={tagsStyles}
      classesStyles={classesStyles}
      baseStyle={{ ...styles.text }}
      systemFonts={systemFonts}
      enableExperimentalBRCollapsing
    />
  );
};

export const SubTermCard: SFC<SubTermCardProps> = ({
  ClassName,
  Id,
  Term,
  Description,
  IsBorderLeft = false,
  Illustration = null,
}) => {
  const TermName = useMemo(() => Term?.trim() ?? '', [Term]);
  const Descriptions = useMemo(() => Description?.trim() ?? '', [Description]);
  const containerClass = IsBorderLeft
    ? 'p-3 border-l-[5px] border-blue-700 px-2'
    : 'bg-blue-100 rounded-lg';

  return (
    <S.View className={ClassName} key={Id}>
      <S.View className="mb-2">
        <S.View className="relative h-fit">
          {TermName && (
            <S.View className="w-full mb-2 flex justify-start items-start">
              <S.Text className="text-md text-slate-600 font-psemibold">{TermName}</S.Text>
            </S.View>
          )}
          {Descriptions && (
            <S.View className={`w-full ${containerClass}`}>
              {Illustration && (
                <ImageZoomViewer images={[{ uri: Illustration }]} imageIndex={0}>
                  <S.View className="w-full my-2">
                    <S.Image
                      source={{ uri: Illustration }}
                      className="w-full h-40 rounded-md"
                      resizeMode="contain"
                    />
                  </S.View>
                </ImageZoomViewer>
              )}
              <S.View className={IsBorderLeft ? 'pl-3' : 'p-3 pl-4'}>
                <HTMLContent html={Descriptions} />
              </S.View>
            </S.View>
          )}
        </S.View>
      </S.View>
    </S.View>
  );
};

