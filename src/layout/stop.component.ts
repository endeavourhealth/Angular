import { Component } from '@angular/core';

@Component({
  selector: 'stop',
  template: `
		<div class="module">
			<div class="container-fluid">
				<div class="module-body">
					<div class="row">
						<div class="col-md-12">

							<div class="panel panel-default">
								<div class="panel-heading">
									<h2><i class="fa fa-ban text-danger"></i> STOP!</h2>
								</div>
								<div class="panel-body">
									<h4>Access Denied</h4>
									You have attempted to access part of the system to which you do not have permission.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`
})
export class StopComponent {

  constructor() { }

}
