import { Component,OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpeechRecognitionService } from '../Services/speechregonition/speech-recognition.service';
import { ChatbotServieService } from '../chatbot-servie.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  isRecording: boolean = false;
  transcriptData: string = '';
  isOpen: boolean = false;
  message: string = '';
  messages: string[] = [];
  recognizedText:string='';
  speech!:string;
 
  pdfContent: SafeResourceUrl | null = null;
  showRecorderBox: boolean = false;
  userMessage: string = '';
  
  isMicrophonePopupOpen = false;
 
  pdfList: { name: string, content: SafeResourceUrl }[] = []; // Array to store uploaded PDFs
 
  constructor(private sanitizer: DomSanitizer, public service : SpeechRecognitionService, private ChatbotService: ChatbotServieService) {
    this.service.init()
   }
 
  handlePdfInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === "application/pdf") {
          const reader = new FileReader();
          reader.onload = () => {
            const pdfContent: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
            this.pdfList.push({ name: file.name, content: pdfContent });
          };
          reader.readAsDataURL(file);
        } else {
          console.error("Please select a PDF file.");
        }
      }
    }
  }
 
  openPdfFileManager() {
    const pdfInput = document.getElementById('pdfInput');
    if (pdfInput) {
      pdfInput.click(); 
    }
  }
 
  showPdfContent(pdf: { name: string, content: SafeResourceUrl }) {
    console.log("Displaying PDF content:", pdf.content);
    this.pdfContent = pdf.content; 
  }
 
  openChat() {
    this.isOpen = true;
  }
 
  closeChat() {
    this.isOpen = false;
  }

  startSpeechRecognition() {
    // Logic to start speech recognition
    console.log("Start speech recognition");
    this.showRecorderBox =  true;
     this.isMicrophonePopupOpen = !this.isMicrophonePopupOpen;
     if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
   
  }
 
startRecording() {
  this.service.start();
  this.isRecording = true;
}

stopRecording() {
  this.service.stop();
  this.isRecording = false;
  this.recognizedText = this.service.text.trim();
  if (this.recognizedText !== '') {
    this.sendMessage(this.recognizedText);
  }
}

toggleSpeechRecognition() {
    if (this.isRecording) {
        this.stopRecording();
    } else {
        this.startRecording();
    }
}

sendMessage(text: string) {
  console.log('Recognized text:', text);
  var transcript =localStorage.getItem('transcript');
  this.speech = transcript ?transcript:""
  this.messages.push(this.speech);  // Call the chatbot API to send the recognized text as a message
  this.ChatbotService.sendMessage(this.speech).subscribe((response: any) => {
    console.log('Chatbot API Response:', response);
    // Add the chatbot's response to the messages array
    this.messages.push(response.Answer);
  }, (error: any) => {
    console.error('Chatbot API Error:', error);
  });
}

sendMessageToAPI() {
  console.log('userMessage:', this.message); // Use the message variable
  // Check if message is defined before sending
  if (this.message.trim() !== '') {
    // Add user's message content to messages array
    this.messages.push(this.message);

    // Call the API to send the message and handle the response
    this.ChatbotService.sendMessage(this.message).subscribe((response: any) => {
      console.log('API Response:', response);
      // Add bot's response content to messages array
      this.messages.push(response.Answer); // Use 'Answer' field for bot's response
      // Handle the API response here
    }, (error: any) => {
      console.error('API Error:', error);
      // Handle the error here
    });

    // Clear message after sending
    this.message = '';
  }
}


handleChatbotResponse() {
  // Mocking chatbot response (replace this with actual logic)
  const chatbotResponse = "This is a chatbot response.";
  // Add chatbot response to messages array
  this.messages.push(chatbotResponse);
}

}