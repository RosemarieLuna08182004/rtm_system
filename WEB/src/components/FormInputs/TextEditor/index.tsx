import { SFC, TextEditorProps } from "../../../types";
import * as S from '../../../styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const TextEditor: SFC<TextEditorProps> = ({ ref, value, onChange, ClassName, isEdit }) => {
    return (
        <S.Container className={ClassName}>
            <S.Content className="w-full">
               <ReactQuill
                    ref={ref}
                    value={value || ''}
                    onChange={onChange}
                    theme="snow"
                    modules={{
                        toolbar: [
                            [{ header: '1' }, { header: '2' }, { font: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link', 'image'],
                            [{ align: [] }],
                            [{ color: [] }, { background: [] }],
                            ['clean'],
                        ],
                    }}
                    formats={[
                        'header', 'font', 'list', 'bold', 'italic', 'underline',
                        'strike', 'link', 'image', 'color', 'background', 'align',
                    ]}
                    readOnly={isEdit} 
                    className={`${isEdit?'':'bg-slate-100'} w-full custom-quill-editor h-full md:h-[250px] `}
                />
            </S.Content>
        </S.Container>
    );
};
